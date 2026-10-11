#!/usr/bin/env python3
"""Final audit of the Traveler task list (TASKS/00_TASK_LIST.md) and detail files (TASKS/TASK-*.md).

Inputs: TASKS/00_TASK_LIST.md, TASKS/TASK-*.md, docs/PROJECT_SCOPE.md,
design-reference/SCREEN_ROUTE_CONTRACT.json.
Outputs: TASKS/TASK_MANIFEST.csv, TASKS/TASK_AUDIT_REPORT.md (rewritten every run; the manifest wave_id column
from scripts/build_waves.py is preserved).

Prints `AUDIT_PASS checks=N` and exits 0 when every check passes, otherwise
prints `AUDIT_FAIL failed=F checks=N` and exits 1.
--list-only skips the checks that need detail files (F01, F18 and the detail part of F19).
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from datetime import datetime
from pathlib import Path

LIST_HEADER = ["Seq", "Task ID", "제목", "Category", "Implementation Status", "Requirement Ref", "Screen", "Route",
               "Page Entry", "Depends On", "Expected Files", "Functional AC", "Visual AC", "Security/Privacy AC",
               "Verify", "Priority"]
NON_IMPL_HEADER = ["Requirement", "요지", "근거", "후속 방향"]
DETAIL_SECTIONS = ["1. Context", "2. Project Scope", "3. Requirement Ref", "4. Screen / Route / Page Entry",
                   "5. Design Ref", "6. Depends On", "7. Expected Files", "8. Functional AC", "9. Visual AC",
                   "10. Security/Privacy AC", "11. Test Cases", "12. Verify", "13. Definition of Done", "14. Forbidden"]
REQ_IDS = [f"REQ-FUNC-{i:03d}" for i in range(1, 81)] + [f"REQ-NF-{i:03d}" for i in range(1, 35)]
SCREEN_NONE = {"공통", "없음"}
TECH_PAGE_ENTRIES = {"src/app/auth/callback/page.tsx"}

# F11/F12: DB scope
DB_TASK_PREFIXES = {"Schema": "DB-SCHEMA", "RLS": "DB-RLS", "Access": "DB-ACCESS", "Seed": "DB-SEED"}
DB_TABLES = {"profiles", "mate_posts", "mate_applications", "user_blocks", "reports", "app_settings"}
DB_TABLE_ALLOWANCE = 1  # "크게 넘지 않음": at most one table beyond the six
FORBIDDEN_TABLES = {"audit_log", "audit_logs", "media_assets", "media_asset", "destinations", "destination_contents",
                    "country_safety", "representative_profile", "notifications", "email_queue", "favorites",
                    "analytics_events", "trip_inputs", "flight_searches", "hotel_searches"}

# F13: trip inputs
TRIP_REQS = {"REQ-FUNC-017", "REQ-FUNC-025", "REQ-NF-017"}
# F16: forbidden implementation scope (negated mentions such as "자동 Merge 없음" are allowed)
FORBIDDEN_SCOPE = re.compile(r"\bec2\b|\baws\b|amazon web services|auto[- ]?merge|merge[- ]runner|자동\s*(merge|머지|병합)", re.I)
NEGATION = re.compile(r"없음|없다|금지|않|제외|하지 말|never|no |not ", re.I)


def split_row(line: str) -> list[str]:
    return [c.strip() for c in re.split(r"(?<!\\)\|", line.strip())[1:-1]]


def find_table(text: str, header: list[str]) -> list[list[str]] | None:
    lines = text.splitlines()
    for i, line in enumerate(lines[:-1]):
        if line.startswith("|") and split_row(line) == header:
            rows = []
            for row in lines[i + 2:]:
                if not row.startswith("|"):
                    break
                rows.append(split_row(row))
            return rows
    return None


def items(cell: str) -> list[str]:
    cell = cell.strip()
    if cell in ("", "-"):
        return []
    return [x.strip().strip("`") for x in cell.split(",") if x.strip()]


def section(md: str, heading: str) -> str:
    m = re.search(rf"^##\s+{re.escape(heading)}\s*$(.*?)(?=^##\s|\Z)", md, re.M | re.S)
    return m.group(1) if m else ""


def scope_statuses(text: str) -> dict[str, str]:
    """REQ-ID -> IMPLEMENT/EXCLUDED from the PROJECT_SCOPE status tables (§9·§10)."""
    out = {}
    for line in text.splitlines():
        m = re.match(r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|[^|]*\|\s*(IMPLEMENT|EXCLUDED)\s*\|", line)
        if m:
            out[m.group(1)] = m.group(2)
    return out


class Audit:
    def __init__(self) -> None:
        self.results: list[tuple[str, str, list[str]]] = []

    def check(self, cid: str, title: str, errors: list[str]) -> None:
        self.results.append((cid, title, errors))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--root", default=Path(__file__).resolve().parent.parent, type=Path)
    ap.add_argument("--list-only", action="store_true", help="skip detail-file checks")
    args = ap.parse_args()
    root: Path = args.root.resolve()
    tasks_dir = root / "TASKS"
    au = Audit()

    missing_inputs = [p for p in ("TASKS/00_TASK_LIST.md", "docs/PROJECT_SCOPE.md",
                                  "design-reference/SCREEN_ROUTE_CONTRACT.json") if not (root / p).is_file()]
    if missing_inputs:
        au.check("F00", "입력 파일 존재", [f"missing input: {p}" for p in missing_inputs])
        return finish(au, root, [], {}, args.list_only)

    contract = json.loads((root / "design-reference/SCREEN_ROUTE_CONTRACT.json").read_text(encoding="utf-8"))
    screens = {s["screen_id"]: s for s in contract.get("screens", [])}
    entries = {s["page_entry"]: sid for sid, s in screens.items()}
    status = scope_statuses((root / "docs/PROJECT_SCOPE.md").read_text(encoding="utf-8"))
    list_text = (tasks_dir / "00_TASK_LIST.md").read_text(encoding="utf-8")
    rows = find_table(list_text, LIST_HEADER) or []
    T = [dict(zip(LIST_HEADER, r)) for r in rows if len(r) == len(LIST_HEADER)]
    ids = [t["Task ID"] for t in T]
    by_id = {t["Task ID"]: t for t in T}
    details: dict[str, str] = {}
    if not args.list_only:
        details = {p.name[5:-3]: p.read_text(encoding="utf-8") for p in tasks_dir.glob("TASK-*.md")}

    def text_of(t: dict, sec: str | None = None, col: str | None = None) -> str:
        """List cell plus the matching detail section (when details are checked)."""
        parts = [t.get(col, "")] if col else []
        if sec and t["Task ID"] in details:
            parts.append(section(details[t["Task ID"]], sec))
        return "\n".join(parts)

    owners: dict[str, list[str]] = {}
    for t in T:
        if t["Category"] == "Page Owner":
            owners.setdefault(t["Screen"], []).append(t["Task ID"])

    # F01 Task List ↔ detail files 1:1
    if args.list_only:
        au.check("F01", "Task List 구현 ID와 상세 파일 1:1 (--list-only: 생략)", [])
    else:
        exp = set(ids)
        got = set(details)
        au.check("F01", "Task List 구현 ID와 상세 파일 1:1",
                 [f"상세 파일 없음: TASK-{i}.md" for i in sorted(exp - got)] +
                 [f"목록에 없는 상세 파일: TASK-{i}.md" for i in sorted(got - exp)])

    # F02 duplicate IDs
    au.check("F02", "중복 Task ID 0", [f"중복 Task ID: {i}" for i in sorted({i for i in ids if ids.count(i) > 1})])

    # F03 missing dependencies
    au.check("F03", "Depends On 누락 0",
             [f"{t['Task ID']}: 없는 Depends On {d}" for t in T for d in items(t["Depends On"]) if d not in by_id])

    # F04 dependency cycles
    graph = {t["Task ID"]: [d for d in items(t["Depends On"]) if d in by_id] for t in T}
    cycles: list[str] = []
    state: dict[str, int] = {}

    def dfs(n: str, path: list[str]) -> None:
        state[n] = 1
        for d in graph.get(n, []):
            if state.get(d) == 1:
                cycles.append(" → ".join(path[path.index(d):] + [d]) if d in path else f"{n} → {d}")
            elif state.get(d) is None:
                dfs(d, path + [d])
        state[n] = 2

    for n in graph:
        if state.get(n) is None:
            dfs(n, [n])
    au.check("F04", "Dependency Cycle 0", [f"순환: {c}" for c in cycles])

    # F05 one page owner per screen
    errs = [f"{sid}: Page Owner {owners.get(sid, [])} (정확히 1개여야 함)" for sid in screens if len(owners.get(sid, [])) != 1]
    errs += [f"{t['Task ID']}: 계약에 없는 Screen의 Page Owner ({t['Screen']})" for t in T
             if t["Category"] == "Page Owner" and t["Screen"] not in screens]
    if len(screens) != 5:
        errs.append(f"계약 Screen 수 {len(screens)} (5여야 함)")
    au.check("F05", "Screen 5개 모두 Page Owner 정확히 1개", errs)

    # F06 route / page entry / expected files
    errs = []
    for t in T:
        tid, scr, files = t["Task ID"], t["Screen"], items(t["Expected Files"])
        if scr in screens:
            want = (screens[scr]["route"], screens[scr]["page_entry"])
            if (t["Route"].strip("`"), t["Page Entry"].strip("`")) != want:
                errs.append(f"{tid}: Route·Page Entry가 계약 {want}와 다름")
        elif scr in SCREEN_NONE:
            if t["Route"] != "-" or t["Page Entry"] != "-":
                errs.append(f"{tid}: Screen {scr}이면 Route·Page Entry는 '-'")
        else:
            errs.append(f"{tid}: 계약에 없는 Screen {scr}")
        owned = [f for f in files if f in entries]
        if len(owned) > 1:
            errs.append(f"{tid}: Page Entry 여러 개 소유 {owned}")
        for f in files:
            if f in entries and not (t["Category"] == "Page Owner" and scr == entries[f]):
                errs.append(f"{tid}: {f}는 {entries[f]} Page Owner만 소유")
            elif f.startswith("src/app/") and f.endswith("page.tsx") and f not in entries and f not in TECH_PAGE_ENTRIES:
                errs.append(f"{tid}: 계약 밖 page.tsx {f}")
            if re.search(r"(^|/)route\.(ts|js)$", f) or f.startswith("src/app/api/"):
                errs.append(f"{tid}: Route Handler·API Route 금지 {f}")
        if t["Category"] == "Page Owner" and scr in screens and screens[scr]["page_entry"] not in files:
            errs.append(f"{tid}: Expected Files에 page_entry {screens[scr]['page_entry']} 없음")
        if tid in details:
            exp_sec = section(details[tid], "7. Expected Files")
            errs += [f"{tid}: 상세 §7에 {f} 없음" for f in files if f"`{f}`" not in exp_sec]
    au.check("F06", "Route·Page Entry·Expected Files 일치", errs)

    # F07 component-only screens
    errs = []
    for sid in screens:
        comps = {t["Task ID"] for t in T if t["Category"] == "Component" and t["Screen"] == sid}
        if comps and not owners.get(sid):
            errs.append(f"{sid}: Component Task만 있고 Page Owner 없음 {sorted(comps)}")
        for oid in owners.get(sid, []):
            missing = comps - set(items(by_id[oid]["Depends On"]))
            if missing:
                errs.append(f"{oid}: 조립할 Component에 의존하지 않음 {sorted(missing)}")
    au.check("F07", "Component-only Screen 0", errs)

    def owner_text(sid: str) -> str:
        return "\n".join(text_of(by_id[o], "8. Functional AC", "Functional AC") for o in owners.get(sid, []))

    # F08 SCR-001 starter removal
    t1 = owner_text("SCR-001")
    au.check("F08", "SCR-001 Starter 제거 AC 존재",
             [] if re.search(r"Starter", t1) and re.search(r"제거|삭제", t1) else ["PAGE-SCR001 Functional AC에 Next.js Starter 제거 조건 없음"])

    # F09 SCR-003 three tabs assembled
    t3 = owner_text("SCR-003")
    missing = [k for k in ("tab=flight", "tab=hotel", "tab=mate") if k not in t3]
    if "조립" not in t3:
        missing.append("조립")
    au.check("F09", "SCR-003 세 탭 조립 AC 존재", [f"PAGE-SCR003 Functional AC에 '{k}' 없음" for k in missing])

    # F10 SCR-005 role states assembled
    t5 = owner_text("SCR-005")
    missing = [k for k in ("Guest", "Member", "Admin", "조립") if k not in t5]
    if not re.search(r"렌더링하지 않", t5):
        missing.append("역할에 없는 영역 미렌더링")
    au.check("F10", "SCR-005 역할별 상태 조립 AC 존재", [f"PAGE-SCR005 Functional AC에 '{k}' 없음" for k in missing])

    # F11 DB schema / RLS / access / seed tasks
    au.check("F11", "DB Schema·RLS·Access·Seed Task 존재",
             [f"DB {name} Task 없음 ({prefix}*)" for name, prefix in DB_TASK_PREFIXES.items()
              if not any(i.startswith(prefix) for i in ids)])

    # F12 DB table scope
    errs = []
    db_tasks = [t for t in T if t["Category"] == "DB" or t["Task ID"].startswith("DB-")]
    db_text = "\n".join("\n".join(v for k, v in t.items() if k != "Seq") + details.get(t["Task ID"], "") for t in db_tasks)
    schema_text = "\n".join("\n".join(t.values()) + details.get(t["Task ID"], "")
                            for t in db_tasks if t["Task ID"].startswith("DB-SCHEMA"))
    errs += [f"DB Schema Task에 기본 테이블 `{n}` 없음" for n in sorted(DB_TABLES) if f"`{n}`" not in schema_text]
    corpus = list_text + "\n".join(details.values())
    created = {n.lower() for n in re.findall(r"create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?([a-z_]+)", corpus, re.I)}
    declared = {n for n in re.findall(r"`([a-z][a-z0-9_]*)`", db_text) if n in FORBIDDEN_TABLES}
    errs += [f"금지 테이블 정의: {n}" for n in sorted((created | declared) & FORBIDDEN_TABLES)]
    extra = created - DB_TABLES
    if len(extra) > DB_TABLE_ALLOWANCE:
        errs.append(f"기본 6개 밖 테이블이 {len(extra)}개: {sorted(extra)} (허용 {DB_TABLE_ALLOWANCE})")
    au.check("F12", "DB Table 범위가 6개 기본 테이블을 크게 넘지 않음", errs)

    # F13 external input non-storage
    errs = []
    targets = [t for t in T if (t["Screen"] == "SCR-003" and t["Category"] == "Page Owner")
               or set(items(t["Requirement Ref"])) & TRIP_REQS]
    if not targets:
        errs.append("항공·숙소 입력 요구사항(REQ-FUNC-017·025, REQ-NF-017)을 다루는 Task 없음")
    for t in targets:
        # The condition must appear in the list row and, when checked, in the detail file's §10.
        sources = {"Task List": t["Security/Privacy AC"]}
        if t["Task ID"] in details:
            sources["상세 §10"] = section(details[t["Task ID"]], "10. Security/Privacy AC")
        for where, sec in sources.items():
            if not all(w in sec for w in ("서버", "DB", "URL")):
                errs.append(f"{t['Task ID']}: {where} Security/Privacy AC에 항공·숙소 입력값의 서버·DB·URL 비저장 조건 없음")
    au.check("F13", "외부 입력 비저장 AC 존재", errs)

    # F14 auth, adult verification, base RLS
    errs = []
    auth = [t for t in T if t["Category"] == "Auth" or t["Task ID"].startswith("AUTH-")]
    if not auth:
        errs.append("Auth Task 없음")
    elif not any(re.search(r"세션|session", text_of(t, "8. Functional AC", "Functional AC"), re.I) for t in auth):
        errs.append("Auth Task Functional AC에 세션 처리 조건 없음")
    rls = [t for t in T if t["Task ID"].startswith("DB-RLS")]
    rls_text = "\n".join(text_of(t, "8. Functional AC", "Functional AC") for t in rls)
    if "RLS" not in rls_text or not re.search(r"활성", rls_text):
        errs.append("DB-RLS Task에 RLS 활성화 AC 없음")
    if "is_adult" not in rls_text:
        errs.append("DB-RLS Task에 성인 확인(`is_adult`) 쓰기 조건 없음")
    all_func = "\n".join(text_of(t, "8. Functional AC", "Functional AC") for t in T)
    if not re.search(r"성인 확인", all_func) or "adult_verified_at" not in all_func:
        errs.append("성인 확인 화면·저장 AC(`is_adult`, `adult_verified_at`) 없음")
    au.check("F14", "Auth·성인·기본 RLS AC 존재", errs)

    # F15 Playwright Chromium smoke
    errs = []
    e2e = [t for t in T if t["Category"] == "E2E Test"]
    if not e2e:
        errs.append("E2E Test Task 없음")
    for t in e2e:
        if "--project=chromium" not in t["Verify"]:
            errs.append(f"{t['Task ID']}: Verify에 --project=chromium 없음")
        bad = [f for f in items(t["Expected Files"]) if not (f.startswith("e2e/") and f.endswith(".spec.ts"))]
        if bad:
            errs.append(f"{t['Task ID']}: E2E 파일은 e2e/*.spec.ts {bad}")
    for t in T:
        if re.search(r"firefox|webkit", " ".join([t["제목"], t["Expected Files"], t["Verify"]]), re.I):
            errs.append(f"{t['Task ID']}: Chromium 밖 브라우저")
    if e2e and not any("playwright.config.ts" in items(t["Expected Files"]) for t in T):
        errs.append("playwright.config.ts를 만드는 Task 없음")
    au.check("F15", "Playwright Chromium Smoke Task 존재", errs)

    # F16 AWS / EC2 / auto-merge implementation tasks
    errs = []
    for t in T:
        for col in ("Task ID", "제목", "Expected Files", "Verify", "Functional AC"):
            for piece in re.split(r"<br>|\n", t[col]):
                m = FORBIDDEN_SCOPE.search(piece)
                if m and not NEGATION.search(piece):
                    errs.append(f"{t['Task ID']}: {col}에 금지 범위 '{m.group(0)}'")
    au.check("F16", "AWS·EC2·자동 Merge 구현 Task 0", errs)

    # F17 requirement coverage
    errs = []
    in_tasks = {r for t in T for r in items(t["Requirement Ref"])}
    non = find_table(list_text, NON_IMPL_HEADER)
    in_excluded = {r[0] for r in non} if non is not None else set()
    if non is None:
        errs.append("NON_IMPLEMENTATION 표(| Requirement | 요지 | 근거 | 후속 방향 |) 없음")
    missing = [r for r in REQ_IDS if r not in in_tasks and r not in in_excluded]
    if missing:
        errs.append(f"Task와 EXCLUDED 표 어디에도 없는 Requirement {len(missing)}개: {', '.join(missing)}")
    errs += [f"{r}: PROJECT_SCOPE 상태 없음" for r in REQ_IDS if r not in status]
    errs += [f"{r}: PROJECT_SCOPE는 IMPLEMENT인데 Task가 없음" for r in REQ_IDS if status.get(r) == "IMPLEMENT" and r not in in_tasks]
    errs += [f"{r}: PROJECT_SCOPE는 EXCLUDED인데 EXCLUDED 표에 없음" for r in REQ_IDS if status.get(r) == "EXCLUDED" and r not in in_excluded]
    errs += [f"{r}: EXCLUDED인데 Task가 참조" for r in sorted(in_tasks) if status.get(r) == "EXCLUDED"]
    errs += [f"{r}: 알 수 없는 Requirement ID" for r in sorted(in_tasks - set(REQ_IDS))]
    au.check("F17", "REQ-FUNC 80개·REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재", errs)

    # F18 no detail files for EXCLUDED
    errs = []
    excluded = {r for r, s in status.items() if s == "EXCLUDED"}
    if not args.list_only:
        for name, md in details.items():
            if name in excluded or name.startswith(("REQ-", "EXCLUDED")):
                errs.append(f"EXCLUDED 상세 파일: TASK-{name}.md")
            row = section(md, "Task Row")
            refs = set(re.findall(r"REQ-(?:FUNC|NF)-\d{3}", row))
            if refs and refs <= excluded:
                errs.append(f"TASK-{name}.md: EXCLUDED 요구사항만 구현하는 상세 파일")
    au.check("F18", "EXCLUDED 상세 구현 파일 미생성" + (" (--list-only: 생략)" if args.list_only else ""), errs)

    # F19 format: list header, detail sections, row copy, outside-edit ban, page owner content contract
    errs = []
    if not rows:
        errs.append(f"Task List 16열 표 없음: {' | '.join(LIST_HEADER)}")
    errs += [f"열 수 오류: {r[1] if len(r) > 1 else r}" for r in rows if len(r) != len(LIST_HEADER)]
    errs += [f"{t['Task ID']}: 빈 열 {h}" for t in T for h in LIST_HEADER if not t[h]]
    errs += [f"{t['Task ID']}: Implementation Status는 IMPLEMENT" for t in T if t["Implementation Status"] != "IMPLEMENT"]
    if not args.list_only:
        header_line = "| " + " | ".join(LIST_HEADER) + " |"
        row_lines = {split_row(l)[1]: l.strip() for l in list_text.splitlines()
                     if l.startswith("|") and len(split_row(l)) == len(LIST_HEADER) and split_row(l)[1] in by_id}
        for tid, md in details.items():
            if tid not in by_id:
                continue
            heads = [h for h in re.findall(r"^##\s+(.+?)\s*$", md, re.M) if re.match(r"\d+\.\s", h)]
            if heads != DETAIL_SECTIONS:
                errs.append(f"{tid}: 상세 절이 14개 규정과 다름")
            if header_line not in md or row_lines.get(tid) not in md:
                errs.append(f"{tid}: Task Row에 목록 머리행·행 원문 없음")
            errs += [f"{tid}: 빈 절 {s}" for s in DETAIL_SECTIONS if not section(md, s).strip()]
            if "Expected Files 밖" not in section(md, "14. Forbidden"):
                errs.append(f"{tid}: §14에 Expected Files 밖 수정 금지 없음")
        for sid, s in screens.items():
            for oid in owners.get(sid, []):
                md = details.get(oid, "")
                visual = section(md, "9. Visual AC")
                pos = [visual.find(f"`{x['id']}`") for x in s.get("sections", [])]
                if -1 in pos or pos != sorted(pos):
                    errs.append(f"{oid}: §9 Section 순서가 계약과 다르거나 빠짐")
                if not find_table(visual, ["항목", "최소 수"]):
                    errs.append(f"{oid}: §9 최소 콘텐츠 표 없음")
                if "Empty State" not in md:
                    errs.append(f"{oid}: Empty State AC 없음")
                forb = section(md, "14. Forbidden")
                if "Placeholder" not in forb or "빈 영역" not in forb:
                    errs.append(f"{oid}: §14에 Placeholder·큰 빈 영역 금지 없음")
                if "하위 Component" not in section(md, "2. Project Scope"):
                    errs.append(f"{oid}: §2에 하위 Component 범위 밖 명시 없음")
    au.check("F19", "Task List·상세 형식과 Page Owner 콘텐츠 계약", errs[:30])

    return finish(au, root, T, details, args.list_only)


def finish(au: Audit, root: Path, T: list[dict], details: dict[str, str], list_only: bool) -> int:
    tasks_dir = root / "TASKS"
    tasks_dir.mkdir(exist_ok=True)
    manifest = tasks_dir / "TASK_MANIFEST.csv"
    # wave_id is owned by scripts/build_waves.py; keep it across audit runs.
    waves: dict[str, str] = {}
    if manifest.is_file():
        with manifest.open(newline="", encoding="utf-8") as fh:
            waves = {r["Task ID"]: r.get("wave_id") or "" for r in csv.DictReader(fh)}
    with manifest.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["Seq", "Task ID", "Category", "Priority", "Screen", "Route", "Page Entry",
                    "Requirement Ref", "Depends On", "Expected Files", "Detail File", "Detail Exists", "wave_id"])
        for t in T:
            detail = f"TASKS/TASK-{t['Task ID']}.md"
            w.writerow([t["Seq"], t["Task ID"], t["Category"], t["Priority"], t["Screen"], t["Route"].strip("`"),
                        t["Page Entry"].strip("`"), t["Requirement Ref"], t["Depends On"],
                        "; ".join(items(t["Expected Files"])), detail, (root / detail).is_file(),
                        waves.get(t["Task ID"], "")])
    failed = [r for r in au.results if r[2]]
    verdict = (f"AUDIT_PASS checks={len(au.results)}" if not failed
               else f"AUDIT_FAIL failed={len(failed)} checks={len(au.results)}")
    lines = ["# Task Audit Report", "",
             f"- 실행 시각: {datetime.now().isoformat(timespec='seconds')}",
             f"- 모드: {'목록만 (--list-only)' if list_only else '목록 + 상세'}",
             f"- Task 수: {len(T)} / 상세 파일 수: {len(details) if not list_only else '생략'}",
             f"- 결과: `{verdict}`", "",
             "| Check | 결과 | 내용 | 오류 |", "|---|---|---|---|"]
    for cid, title, errs in au.results:
        lines.append(f"| {cid} | {'FAIL' if errs else 'PASS'} | {title} | "
                     f"{'<br>'.join(e.replace('|', '/') for e in errs[:20]) or '-'} |")
    (tasks_dir / "TASK_AUDIT_REPORT.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    for cid, title, errs in au.results:
        print(f"[{'FAIL' if errs else 'PASS'}] {cid} {title}")
        for e in errs[:20]:
            print(f"    - {e}")
        if len(errs) > 20:
            print(f"    - ... {len(errs) - 20} more")
    print(verdict)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
