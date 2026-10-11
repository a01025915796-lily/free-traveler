#!/usr/bin/env python3
"""Build the Traveler Wave plan from the Task manifest.

Inputs : TASKS/TASK_MANIFEST.csv, TASKS/details/TASK-*.md (fallback TASKS/TASK-*.md),
         design-reference/SCREEN_ROUTE_CONTRACT.json
Outputs: TASKS/TASK_DAG.md, TASKS/WAVE_PLAN.md, TASKS/WAVE_STATE.json,
         TASKS/TASK_MANIFEST.csv (wave_id column)

Rules
  1. Read Depends On and detect dependency cycles.
  2. Fail if a dependency is placed in a later Wave than its dependent.
  3. Default 4-7 Tasks per Wave (groups larger than 7 are split; smaller groups only warn).
  4. A Page Owner is the last integration Task of its Screen.
  5. Tasks that touch the same file go to different Waves.
  6. Inside a Wave, Tasks run one at a time in Task List order (Seq).
  7. No auto-fix/retry loops. 8. No Branch/PR/Merge automation.

Wave IDs are not fixed in advance: they are numbered W01.. in the order produced here.
The generated WAVE_PLAN.md / WAVE_STATE.json are the source of truth for later steps.

Usage: python3 scripts/build_waves.py [--root .] [--check] [--force]
  --check  validate and print the plan without writing files
  --force  overwrite a WAVE_STATE.json that already has progress (status other than pending)
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

SCHEMA_VERSION = "traveler-wave-state-v2"
MAX_PER_WAVE = 7
MIN_PER_WAVE = 4

# Wave groups in execution order.
GROUPS = {
    1: "Scaffold·문서·Harness 확인",
    2: "공통 UI·정적 데이터·Layout",
    3: "Supabase Auth·6개 Table·기본 RLS",
    4: "SCR-001 메인",
    5: "SCR-002 대표 소개",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력",
    7: "SCR-004 동행 목록·상세·신청",
    8: "SCR-005 계정·내 활동·간단 관리자",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview·Release 확인",
}
SCREEN_GROUP = {"SCR-001": 4, "SCR-002": 5, "SCR-003": 6, "SCR-004": 7, "SCR-005": 8}
CATEGORY_GROUP = {
    "Setup": 1,
    "Global": 2, "Data": 2,
    "DB": 3, "Auth": 3,
    "CI": 9, "Unit Test": 9, "Integration Test": 9, "E2E Test": 9,
    # MANUAL-CHECK measures the deployed URL, so it follows Deploy.
    "Manual Check": 10, "Deploy": 10, "Release": 10,
}
TECH_ROUTE_GROUP = {"TECH-ERROR-PAGES": 2, "TECH-AUTH-CALLBACK": 3}
TEST_CATEGORIES = {"Unit Test", "Integration Test", "E2E Test", "Manual Check", "Release"}
PREREQUISITES = {
    3: "착수 차단 해결(`docs/ARCHITECTURE.md` §12): 원격 Supabase 테스트 프로젝트(DEC-019), `.env.local` 3개 값, `supabase login`",
    9: "테스트 계정 3개(`E2E_USER_A_*`, `E2E_USER_B_*`, `E2E_ADMIN_*`), Git 원격 저장소·`gh auth login`(CI 확인)",
    10: "Vercel 프로젝트 연결",
}


class BuildError(Exception):
    pass


def split_list(cell: str) -> list[str]:
    cell = (cell or "").strip()
    if cell in ("", "-", "없음"):
        return []
    return [x.strip() for x in re.split(r"[;,]", cell) if x.strip()]


def detail_dir(root: Path) -> Path:
    d = root / "TASKS" / "details"
    return d if d.is_dir() else root / "TASKS"


def detail_files(text: str) -> tuple[list[str], list[str]]:
    """Return (created, modified) paths from detail §7 Expected Files."""
    m = re.search(r"^## 7\. Expected Files\n(.*?)(?=^## 8\.)", text, re.S | re.M)
    if not m:
        return [], []
    created: list[str] = []
    modified: list[str] = []
    cur = created
    for line in m.group(1).splitlines():
        if line.startswith("**수정**"):
            cur = modified
        elif line.startswith("**생성**"):
            cur = created
        else:
            f = re.match(r"^- `([^`]+)`", line)
            if f:
                cur.append(f.group(1))
    return created, modified


def load(root: Path) -> tuple[list[dict], dict, list[str]]:
    man = root / "TASKS" / "TASK_MANIFEST.csv"
    con = root / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
    for p in (man, con):
        if not p.is_file():
            raise BuildError(f"입력 파일 없음: {p.relative_to(root)}")
    with man.open(encoding="utf-8", newline="") as fh:
        rows = list(csv.DictReader(fh))
    contract = json.loads(con.read_text(encoding="utf-8"))
    ddir = detail_dir(root)
    tasks, errors = [], []
    for r in rows:
        tid = r["Task ID"]
        p = ddir / f"TASK-{tid}.md"
        created, modified = [], []
        if p.is_file():
            created, modified = detail_files(p.read_text(encoding="utf-8"))
        else:
            errors.append(f"상세 파일 없음: {p.relative_to(root)}")
        files = set(split_list(r["Expected Files"])) | set(created) | set(modified)
        tasks.append({
            "seq": int(r["Seq"]), "id": tid, "category": r["Category"], "screen": r["Screen"],
            "deps": split_list(r["Depends On"]), "files": sorted(files), "modified": modified,
            "detail": str(p.relative_to(root)),
        })
    return tasks, contract, errors


def find_cycles(tasks: list[dict]) -> list[list[str]]:
    """Tarjan SCC; a cycle is an SCC with >1 node or a self-loop."""
    graph = {t["id"]: t["deps"] for t in tasks}
    index, low, stack, on, out, n = {}, {}, [], set(), [], [0]

    def visit(v: str) -> None:
        index[v] = low[v] = n[0]
        n[0] += 1
        stack.append(v)
        on.add(v)
        for w in graph.get(v, []):
            if w not in graph:
                continue
            if w not in index:
                visit(w)
                low[v] = min(low[v], low[w])
            elif w in on:
                low[v] = min(low[v], index[w])
        if low[v] == index[v]:
            comp = []
            while True:
                w = stack.pop()
                on.discard(w)
                comp.append(w)
                if w == v:
                    break
            if len(comp) > 1 or v in graph.get(v, []):
                out.append(sorted(comp))

    sys.setrecursionlimit(10000)
    for v in graph:
        if v not in index:
            visit(v)
    return out


def assign_groups(tasks: list[dict]) -> dict[str, int]:
    by_id = {t["id"]: t for t in tasks}
    consumers = defaultdict(list)
    for t in tasks:
        for d in t["deps"]:
            consumers[d].append(t["id"])
    group: dict[str, int] = {}
    for t in tasks:
        if t["category"] in ("Component", "Page Owner"):
            if t["screen"] not in SCREEN_GROUP:
                raise BuildError(f"{t['id']}: Screen `{t['screen']}`가 계약 Screen이 아님")
            group[t["id"]] = SCREEN_GROUP[t["screen"]]
        elif t["category"] == "Tech Route":
            group[t["id"]] = TECH_ROUTE_GROUP.get(t["id"], 2)
        elif t["category"] in CATEGORY_GROUP:
            group[t["id"]] = CATEGORY_GROUP[t["category"]]
        elif t["category"] != "Logic":
            raise BuildError(f"{t['id']}: Category `{t['category']}`의 Wave 그룹 규칙 없음")
    # Logic: the earliest group of its non-test consumers, never before its own dependencies.
    for t in sorted(tasks, key=lambda x: x["seq"]):
        if t["category"] != "Logic":
            continue
        cons = [group[c] for c in consumers[t["id"]]
                if c in group and by_id[c]["category"] not in TEST_CATEGORIES]
        floor = max((group[d] for d in t["deps"] if d in group), default=1)
        group[t["id"]] = max(min(cons, default=2), floor)
    return group


def split_group(items: list[dict]) -> list[list[dict]]:
    """Split one group into Waves of at most 7, balanced, separating file conflicts."""
    # Page Owner goes last (rule 4); otherwise Task List order.
    items = sorted(items, key=lambda t: (t["category"] == "Page Owner", t["seq"]))
    k = max(1, math.ceil(len(items) / MAX_PER_WAVE))
    target = math.ceil(len(items) / k)
    waves: list[list[dict]] = [[]]
    for t in items:
        cur = waves[-1]
        used = {f for x in cur for f in x["files"]}
        if cur and (len(cur) >= target or used & set(t["files"])):
            waves.append([])
        waves[-1].append(t)
    return waves


def build(tasks: list[dict], contract: dict) -> tuple[list[dict], dict[str, str], list[str]]:
    ids = {t["id"] for t in tasks}
    errors, warnings = [], []
    for t in tasks:
        for d in t["deps"]:
            if d not in ids:
                errors.append(f"{t['id']}: Depends On `{d}`가 Manifest에 없음")
    if errors:
        raise BuildError("\n".join(errors))

    group = assign_groups(tasks)
    by_group = defaultdict(list)
    for t in tasks:
        by_group[group[t["id"]]].append(t)

    waves, wave_of = [], {}
    for g in sorted(by_group):
        parts = split_group(by_group[g])
        for i, part in enumerate(parts, 1):
            wid = f"W{len(waves) + 1:02d}"
            title = GROUPS[g] + (f" ({i}/{len(parts)})" if len(parts) > 1 else "")
            has_owner = any(t["category"] == "Page Owner" for t in part)
            is_release = g == 10 and i == len(parts)
            waves.append({
                "wave_id": wid, "group": g, "title": title, "tasks": part,
                "checkpoint_type": "preview" if has_owner else ("release" if is_release else None),
                "prerequisites": PREREQUISITES.get(g) if i == 1 else None,
            })
            for t in part:
                wave_of[t["id"]] = wid

    order = {t["id"]: (int(wave_of[t["id"]][1:]), pos)
             for w in waves for pos, t in enumerate(w["tasks"])}
    # Rule 2 (and in-Wave order): every dependency must run before its dependent.
    for t in tasks:
        for d in t["deps"]:
            if order[d] >= order[t["id"]]:
                errors.append(f"{t['id']}({wave_of[t['id']]})의 선행 Task {d}가 {wave_of[d]}에서 뒤에 실행됨")
    # Rule 4: Page Owner is the last Task of its Screen and owns the contract page entry.
    entries = {s["screen_id"]: s["page_entry"] for s in contract.get("screens", [])}
    for sid, entry in entries.items():
        owners = [t for t in tasks if t["category"] == "Page Owner" and t["screen"] == sid]
        if len(owners) != 1:
            errors.append(f"{sid}: Page Owner {len(owners)}개 (정확히 1개 필요)")
            continue
        owner = owners[0]
        if entry not in owner["files"]:
            errors.append(f"{owner['id']}: Page Entry `{entry}`가 Expected Files에 없음")
        later = [t["id"] for t in tasks if t["screen"] == sid and t is not owner
                 and order[t["id"]] > order[owner["id"]]]
        if later:
            errors.append(f"{owner['id']} 뒤에 같은 Screen Task가 있음: {', '.join(later)}")
    # Rule 5: shared files never inside one Wave.
    for w in waves:
        seen = {}
        for t in w["tasks"]:
            for f in t["files"]:
                if f in seen:
                    errors.append(f"{w['wave_id']}: `{f}`를 {seen[f]}와 {t['id']}가 함께 수정")
                seen[f] = t["id"]
    # Rule 3: size.
    for w in waves:
        n = len(w["tasks"])
        if n > MAX_PER_WAVE:
            errors.append(f"{w['wave_id']}: Task {n}개 (최대 {MAX_PER_WAVE})")
        elif n < MIN_PER_WAVE:
            warnings.append(f"{w['wave_id']} {w['title']}: Task {n}개 (기본 {MIN_PER_WAVE}~{MAX_PER_WAVE}개보다 적음 — 그룹 Task 수가 적어 그대로 둠)")
    if errors:
        raise BuildError("\n".join(errors))
    return waves, wave_of, warnings


# ---------------------------------------------------------------- state

def existing_progress(path: Path) -> dict:
    """Return {wave_id: wave} from an existing v2 state, or {} when there is no progress to keep."""
    if not path.is_file():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema_version") == SCHEMA_VERSION:
        return {w["wave_id"]: w for w in data.get("waves", [])}
    # Legacy schema: refuse to drop real progress.
    legacy = data.get("waves", {})
    busy = [wid for wid, w in (legacy.items() if isinstance(legacy, dict) else [])
            if w.get("status") != "PENDING"
            or any(x.get("status") != "PENDING" for x in w.get("tasks", {}).values())]
    if busy:
        raise BuildError(f"기존 WAVE_STATE.json(구 schema)에 진행 기록이 있음: {', '.join(busy)}. --force로만 덮어쓴다")
    return {}


def make_state(waves: list[dict], old: dict, force: bool, now: str) -> dict:
    out = []
    for w in waves:
        ids = [t["id"] for t in w["tasks"]]
        prev = old.get(w["wave_id"])
        keep = prev and prev.get("task_ids") == ids
        progressed = prev and (prev.get("status") != "pending"
                               or any(x.get("status") != "pending" for x in prev.get("tasks", {}).values()))
        if progressed and not keep and not force:
            raise BuildError(f"{w['wave_id']}: 진행 기록이 있는데 Task 구성이 바뀜. --force로만 덮어쓴다")
        tasks = {tid: (prev["tasks"][tid] if keep and tid in prev.get("tasks", {}) else
                       {"status": "pending", "finished_at": None, "verify": None, "note": None}) for tid in ids}
        out.append({
            "wave_id": w["wave_id"],
            "title": w["title"],
            "group": w["group"],
            "task_ids": ids,
            "status": prev["status"] if keep else "pending",
            "checkpoint_required": w["checkpoint_type"] is not None,
            "checkpoint_type": w["checkpoint_type"],
            "checkpoint_result": prev.get("checkpoint_result") if keep else None,
            "checkpoint_at": prev.get("checkpoint_at") if keep else None,
            "prerequisites": w["prerequisites"],
            "started_at": prev.get("started_at") if keep else None,
            "finished_at": prev.get("finished_at") if keep else None,
            "blocked_reason": prev.get("blocked_reason") if keep else None,
            "tasks": tasks,
        })
    return {
        "schema_version": SCHEMA_VERSION,
        "generated_at": now,
        "generated_by": "scripts/build_waves.py",
        "status_values": {
            "wave": ["pending", "in_progress", "blocked", "completed"],
            "task": ["pending", "in_progress", "blocked", "failed", "completed"],
            "checkpoint_result": [None, "approved", "changes_requested", "release_ready", "release_blocked"],
        },
        "waves": out,
    }


# ---------------------------------------------------------------- documents

def cp_label(w: dict) -> str:
    return {"preview": "PREVIEW — 사람이 Desktop 1440·Mobile 390 확인 후 승인",
            "release": "RELEASE — `/release-check` 판정 후 사용자가 Production 배포"}.get(w["checkpoint_type"], "없음")


def write_plan(root: Path, waves: list[dict], warnings: list[str], now: str) -> None:
    total = sum(len(w["tasks"]) for w in waves)
    L = [
        "# Traveler Wave Plan", "",
        "| 항목 | 내용 |", "|---|---|",
        f"| 생성 | {now} — `python3 scripts/build_waves.py` (직접 고치지 않는다. Task를 바꾸면 Script를 다시 실행한다) |",
        "| 입력 | `TASKS/TASK_MANIFEST.csv`, Task 상세 파일, `design-reference/SCREEN_ROUTE_CONTRACT.json` |",
        "| 진행 상태 | `TASKS/WAVE_STATE.json` |",
        "| 실행 명령 | `/run-wave <Wave ID>` (`.claude/commands/run-wave.md`) |",
        f"| Wave 수 | {len(waves)} |",
        f"| Task 수 | {total} |", "",
        "## 1. 규칙", "",
        "- Wave ID는 이 파일과 `WAVE_STATE.json`이 정본이다. 다른 문서의 예전 Wave 번호보다 우선한다.",
        "- Wave는 번호 순서로 진행한다. 앞 Wave가 `completed`여야 다음 Wave를 시작한다.",
        "- Wave 안의 Task는 아래 표의 실행 순서(Task List Seq 순서)로 **한 번에 하나씩** 구현한다. 병렬 실행하지 않는다.",
        "- 선행 Task는 항상 같은 Wave의 앞 순서나 이전 Wave에 있다. 같은 파일을 다루는 Task는 같은 Wave에 두지 않는다.",
        "- Page Owner는 자기 Screen의 마지막 통합 Task다. Page Owner가 있는 Wave는 PREVIEW Checkpoint에서 멈춘다.",
        "- PREVIEW 확인은 Vercel Preview URL로 한다. Vercel 연결 전에는 로컬 `npm run dev` 화면으로 확인한다.",
        "- 선행 조건이 충족되지 않은 Wave는 시작하지 않고 `blocked`로 기록한다.",
        "- 자동 재시도·자동 Branch·PR·Merge 기능은 없다. Commit은 사용자가 요청할 때만, Push·PR·Merge·배포는 사용자가 한다.", "",
        "## 2. Wave 요약", "",
        "| Wave | 그룹 | 이름 | Task 수 | Checkpoint | 선행 조건 |",
        "|---|---:|---|---:|---|---|",
    ]
    prev = None
    for w in waves:
        pre = [f"{prev} completed" + ("(Checkpoint 승인)" if waves[int(prev[1:]) - 1]["checkpoint_type"] == "preview" else "")] if prev else []
        if w["prerequisites"]:
            pre.append(w["prerequisites"])
        L.append(f"| {w['wave_id']} | {w['group']} | {w['title']} | {len(w['tasks'])} | {cp_label(w)} | {' + '.join(pre) or '없음'} |")
        prev = w["wave_id"]
    L += ["", "## 3. Wave별 Task (실행 순서)", "",
          "| Wave | 순서 | Seq | Task | Category | Screen | Depends On |", "|---|---:|---:|---|---|---|---|"]
    for w in waves:
        for i, t in enumerate(w["tasks"], 1):
            L.append(f"| {w['wave_id']} | {i} | {t['seq']} | {t['id']} | {t['category']} | {t['screen']} | {', '.join(t['deps']) or '-'} |")
    L += ["", "## 4. Page Owner 위치", "", "| Screen | Page Owner | Wave | Wave 안 순서 |", "|---|---|---|---|"]
    for w in waves:
        for i, t in enumerate(w["tasks"], 1):
            if t["category"] == "Page Owner":
                L.append(f"| {t['screen']} | {t['id']} | {w['wave_id']} | {i}/{len(w['tasks'])} (마지막) |")
    L += ["", "## 5. 경고", ""] + ([f"- {x}" for x in warnings] or ["- 없음"])
    (root / "TASKS" / "WAVE_PLAN.md").write_text("\n".join(L) + "\n", encoding="utf-8")


def write_dag(root: Path, tasks: list[dict], wave_of: dict, cycles: list, now: str) -> None:
    by_id = {t["id"]: t for t in tasks}
    level: dict[str, int] = {}
    for t in sorted(tasks, key=lambda x: x["seq"]):
        level[t["id"]] = 1 + max((level.get(d, 0) for d in t["deps"]), default=0)
    edges = sum(len(t["deps"]) for t in tasks)
    L = [
        "# Traveler Task DAG", "",
        "| 항목 | 내용 |", "|---|---|",
        f"| 생성 | {now} — `python3 scripts/build_waves.py` |",
        f"| Task 수 | {len(tasks)} |", f"| 의존 간선 수 | {edges} |",
        f"| 순환 의존성 | {len(cycles)} |",
        f"| 최장 의존 단계 | {max(level.values(), default=0)} |", "",
        "## 1. Task 의존 관계", "",
        "| Seq | Task | Category | 단계 | Wave | Depends On | 후행 Task |", "|---:|---|---|---:|---|---|---|",
    ]
    after = defaultdict(list)
    for t in tasks:
        for d in t["deps"]:
            after[d].append(t["id"])
    for t in sorted(tasks, key=lambda x: x["seq"]):
        L.append(f"| {t['seq']} | {t['id']} | {t['category']} | {level[t['id']]} | {wave_of[t['id']]} | "
                 f"{', '.join(t['deps']) or '-'} | {', '.join(after[t['id']]) or '-'} |")
    L += ["", "## 2. 그래프", "", "```mermaid", "flowchart LR"]
    for wid in sorted(set(wave_of.values())):
        L.append(f"  subgraph {wid}")
        for t in sorted(tasks, key=lambda x: x["seq"]):
            if wave_of[t["id"]] == wid:
                L.append(f"    {t['id'].replace('-', '_')}[\"{t['id']}\"]")
        L.append("  end")
    for t in tasks:
        for d in t["deps"]:
            L.append(f"  {d.replace('-', '_')} --> {t['id'].replace('-', '_')}")
    L += ["```", ""]
    if cycles:
        L += ["## 3. 순환 의존성", ""] + [f"- {' → '.join(c)}" for c in cycles]
    (root / "TASKS" / "TASK_DAG.md").write_text("\n".join(L) + "\n", encoding="utf-8")


def write_manifest(root: Path, wave_of: dict) -> None:
    p = root / "TASKS" / "TASK_MANIFEST.csv"
    with p.open(encoding="utf-8", newline="") as fh:
        rows = list(csv.reader(fh))
    head = rows[0]
    if "wave_id" not in head:
        head.append("wave_id")
    col = head.index("wave_id")
    tid = head.index("Task ID")
    for r in rows[1:]:
        r += [""] * (len(head) - len(r))
        r[col] = wave_of.get(r[tid], "")
    with p.open("w", encoding="utf-8", newline="") as fh:
        csv.writer(fh).writerows(rows)


# ---------------------------------------------------------------- main

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--root", type=Path, default=Path("."))
    ap.add_argument("--check", action="store_true", help="파일을 쓰지 않고 검사·출력만")
    ap.add_argument("--force", action="store_true", help="진행 기록이 있는 WAVE_STATE.json도 덮어씀")
    args = ap.parse_args()
    root = args.root.resolve()
    now = datetime.now().astimezone().isoformat(timespec="seconds")
    try:
        tasks, contract, input_errors = load(root)
        cycles = find_cycles(tasks)
        print(f"순환 의존성: {len(cycles)}")
        for c in cycles:
            print(f"  - {' → '.join(c)}")
        if input_errors:
            raise BuildError("\n".join(input_errors))
        if cycles:
            raise BuildError("순환 의존성이 있어 Wave를 만들 수 없다")
        waves, wave_of, warnings = build(tasks, contract)
        state_path = root / "TASKS" / "WAVE_STATE.json"
        old = existing_progress(state_path) if not args.force else {}
        state = make_state(waves, old, args.force, now)
    except BuildError as e:
        print(f"[FAIL] {e}")
        print("BUILD_WAVES_FAIL")
        return 1

    print(f"Wave 수: {len(waves)} / Task 수: {len(tasks)}")
    print("Wave별 Task 수:")
    for w in waves:
        cp = f" [{w['checkpoint_type'].upper()}]" if w["checkpoint_type"] else ""
        print(f"  {w['wave_id']} {len(w['tasks']):>2}  {w['title']}{cp}")
    print("Page Owner 위치:")
    for w in waves:
        for i, t in enumerate(w["tasks"], 1):
            if t["category"] == "Page Owner":
                print(f"  {t['screen']} {t['id']} → {w['wave_id']} {i}/{len(w['tasks'])}")
    for x in warnings:
        print(f"[WARN] {x}")
    if args.check:
        print("BUILD_WAVES_PASS (check only, 파일을 쓰지 않음)")
        return 0
    write_dag(root, tasks, wave_of, cycles, now)
    write_plan(root, waves, warnings, now)
    state_path.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_manifest(root, wave_of)
    print("작성: TASKS/TASK_DAG.md, TASKS/WAVE_PLAN.md, TASKS/WAVE_STATE.json, TASKS/TASK_MANIFEST.csv(wave_id)")
    print("BUILD_WAVES_PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
