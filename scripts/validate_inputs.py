#!/usr/bin/env python3
"""Validate the inputs of the Traveler task-generation pipeline.

Runs 11 checks (package, app entry files, documents, D-001 design lock,
screen-route contract, requirement coverage, AWS/EC2 exclusion).

On success prints `VALIDATE_INPUTS_PASS checks=11` and writes
TASKS/INPUT_SNAPSHOT.json (src/app tree, package versions, requirement status),
which /gen-tasklist and scripts/audit_tasks.py read.
On failure prints the missing files, screens and requirement IDs and exits 1.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

HARNESS_SCHEMA = "traveler-screen-route-v1"
EXPECTED_SCREENS = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]
EXPECTED_ROUTES = ["/", "/about", "/travel-tools", "/mates", "/account"]
REQ_FUNC = [f"REQ-FUNC-{i:03d}" for i in range(1, 81)]
REQ_NF = [f"REQ-NF-{i:03d}" for i in range(1, 35)]

APP_FILES = ["src/app/page.tsx", "src/app/layout.tsx"]
DOCS = {
    "PRD": ["docs/01_PRD.md"],
    "SRS": ["docs/02_SRS_BASELINE.md", "docs/06_SRS_UIUX_REVISED.md", "docs/UIUX_TRACEABILITY.md"],
    "Project Scope": ["docs/PROJECT_SCOPE.md"],
    "UI": ["docs/03_UI_COVERAGE_ANALYSIS.md", "docs/04_UIUX_PLAN.md", "docs/05_UIUX_APPROVED.md",
           "design-reference/UI_CONTRACT.md"],
}
DESIGN_DIR = "design-reference/D-001"
DESIGN_MD = f"{DESIGN_DIR}/DESIGN.md"
CONTRACT = "design-reference/SCREEN_ROUTE_CONTRACT.json"
SCOPE = "docs/PROJECT_SCOPE.md"
SRS_REVISED = "docs/06_SRS_UIUX_REVISED.md"

# App Router page file: src/app/<segment>/.../page.tsx with static, (group) or [dynamic] segments.
PAGE_ENTRY_RE = re.compile(r"^src/app(?:/(?:[a-z0-9][a-z0-9-]*|\([a-z0-9-]+\)|\[{1,2}\.{0,3}[a-zA-Z0-9_]+\]{1,2}))*/page\.(?:tsx|ts|jsx|js)$")

# AWS/EC2 may appear only where the text excludes them.
AWS_RE = re.compile(r"\b(?:aws|ec2)\b|amazon web services|@aws-sdk|aws-sdk|aws-cdk", re.I)
EXCLUSION_RE = re.compile(r"제외|EXCLUDED|금지|만들지 않|하지 않|쓰지 않|사용하지 않|않는다|Out[- ]of[- ]Scope|forbidden|not allowed|do not|don't|never|forbidden_features", re.I)
AWS_SCAN = ["docs/PROJECT_SCOPE.md", "docs/06_SRS_UIUX_REVISED.md", "docs/05_UIUX_APPROVED.md",
            "design-reference/UI_CONTRACT.md", CONTRACT, "package.json"]
AWS_CONFIG_FILES = ["serverless.yml", "serverless.yaml", "cdk.json", "appspec.yml", "buildspec.yml",
                    "samconfig.toml", "template.yaml", ".ebextensions", "copilot", "infra/aws"]


class Report:
    def __init__(self) -> None:
        self.results: list[tuple[int, str, bool, list[str]]] = []

    def check(self, n: int, title: str, errors: list[str]) -> None:
        self.results.append((n, title, not errors, errors))


def find_design_manifest(root: Path) -> tuple[Path | None, bool]:
    """Return (manifest path, is_locked) for the first *MANIFEST* .json/.md file in D-001."""
    d = root / DESIGN_DIR
    if not d.is_dir():
        return None, False
    for p in sorted(d.iterdir()):
        if p.is_file() and "manifest" in p.name.lower() and p.suffix.lower() in (".json", ".md"):
            return p, "LOCKED" in p.read_text(encoding="utf-8")
    return None, False


def route_of(entry: str) -> str:
    """src/app/(group)/about/page.tsx -> /about"""
    parts = entry.split("/")[2:-1]
    parts = [p for p in parts if not (p.startswith("(") and p.endswith(")"))]
    return "/" + "/".join(parts)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--root", default=Path(__file__).resolve().parent.parent, type=Path)
    ap.add_argument("--no-snapshot", action="store_true", help="do not write TASKS/INPUT_SNAPSHOT.json")
    args = ap.parse_args()
    root: Path = args.root.resolve()
    rep = Report()

    # 1. package.json has Next.js
    errs: list[str] = []
    pkg: dict = {}
    pkg_path = root / "package.json"
    if not pkg_path.is_file():
        errs.append("missing file: package.json")
    else:
        try:
            pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            errs.append(f"package.json is not valid JSON: {e}")
        if pkg and "next" not in {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}:
            errs.append("package.json has no `next` dependency")
    rep.check(1, "package.json에 Next.js 의존성", errs)

    # 2. app entry files
    rep.check(2, "src/app/page.tsx, src/app/layout.tsx 존재",
              [f"missing file: {f}" for f in APP_FILES if not (root / f).is_file()])

    # 3. documents
    errs = [f"missing {kind} document: {f}" for kind, files in DOCS.items() for f in files if not (root / f).is_file()]
    rep.check(3, "PRD·SRS·Project Scope·UI 문서 존재", errs)

    # 4. D-001 DESIGN.md and LOCKED manifest
    errs = []
    if not (root / DESIGN_MD).is_file():
        errs.append(f"missing file: {DESIGN_MD}")
    manifest, locked = find_design_manifest(root)
    if manifest is None:
        errs.append(f"missing file: LOCKED manifest in {DESIGN_DIR}/ (e.g. {DESIGN_DIR}/MANIFEST.json)")
    elif not locked:
        errs.append(f"{manifest.relative_to(root)} is not marked LOCKED")
    rep.check(4, "D-001 DESIGN.md와 LOCKED Manifest 존재", errs)

    # 5. contract parses
    contract: dict = {}
    errs = []
    cpath = root / CONTRACT
    if not cpath.is_file():
        errs.append(f"missing file: {CONTRACT}")
    else:
        try:
            contract = json.loads(cpath.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            errs.append(f"{CONTRACT} is not valid JSON: {e}")
        if contract and contract.get("schema_version") != HARNESS_SCHEMA:
            errs.append(f"schema_version is {contract.get('schema_version')!r}, expected {HARNESS_SCHEMA!r}")
    rep.check(5, "SCREEN_ROUTE_CONTRACT.json JSON 파싱", errs)
    screens = contract.get("screens", []) if isinstance(contract.get("screens"), list) else []

    # 6. exactly 5 screens
    rep.check(6, "Screen 수 정확히 5개",
              [] if len(screens) == 5 else [f"screen count is {len(screens)}, expected 5"])

    # 7. SCR-001..005 present
    ids = [s.get("screen_id") for s in screens]
    errs = [f"missing screen: {sid}" for sid in EXPECTED_SCREENS if sid not in ids]
    errs += [f"duplicate screen: {sid}" for sid in sorted({i for i in ids if ids.count(i) > 1})]
    errs += [f"unexpected screen: {sid}" for sid in ids if sid not in EXPECTED_SCREENS]
    rep.check(7, "SCR-001~005 모두 존재", errs)

    # 8. routes
    routes = [s.get("route") for s in screens]
    errs = [f"missing route: {r}" for r in EXPECTED_ROUTES if r not in routes]
    errs += [f"unexpected route: {r} ({s.get('screen_id')})" for s in screens for r in [s.get("route")] if r not in EXPECTED_ROUTES]
    errs += [f"duplicate route: {r}" for r in sorted({r for r in routes if routes.count(r) > 1})]
    rep.check(8, "Route가 /, /about, /travel-tools, /mates, /account", errs)

    # 9. page entries are App Router page files matching the route
    errs = []
    entries = [s.get("page_entry") or "" for s in screens]
    for s, e in zip(screens, entries):
        sid = s.get("screen_id")
        if not PAGE_ENTRY_RE.match(e):
            errs.append(f"{sid}: page_entry {e!r} is not an App Router page path (src/app/**/page.tsx)")
        elif route_of(e) != s.get("route"):
            errs.append(f"{sid}: page_entry {e} serves {route_of(e)}, not {s.get('route')}")
    errs += [f"duplicate page_entry: {e}" for e in sorted({e for e in entries if entries.count(e) > 1})]
    rep.check(9, "Page Entry가 Next.js App Router 경로 형식", errs)

    # 10. PROJECT_SCOPE mentions every requirement
    errs = []
    spath = root / SCOPE
    if not spath.is_file():
        errs.append(f"missing file: {SCOPE}")
    else:
        found = set(re.findall(r"REQ-(?:FUNC|NF)-\d{3}", spath.read_text(encoding="utf-8")))
        missing_func = [r for r in REQ_FUNC if r not in found]
        missing_nf = [r for r in REQ_NF if r not in found]
        if missing_func:
            errs.append(f"PROJECT_SCOPE missing {len(missing_func)} REQ-FUNC: {', '.join(missing_func)}")
        if missing_nf:
            errs.append(f"PROJECT_SCOPE missing {len(missing_nf)} REQ-NF: {', '.join(missing_nf)}")
    rep.check(10, "PROJECT_SCOPE에 REQ-FUNC 80개·REQ-NF 34개", errs)

    # 11. AWS/EC2 not defined as active technology
    errs = []
    for f in AWS_SCAN:
        p = root / f
        if not p.is_file():
            continue
        heading = ""
        for no, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
            if line.startswith("#"):
                heading = line
            # A mention is allowed when the line itself or its section heading states an exclusion.
            if AWS_RE.search(line) and not EXCLUSION_RE.search(line) and not EXCLUSION_RE.search(heading):
                errs.append(f"{f}:{no}: AWS/EC2 used as active technology: {line.strip()[:120]}")
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    errs += [f"package.json: AWS dependency {d}" for d in deps if d.startswith("@aws-sdk/") or d in ("aws-sdk", "aws-cdk-lib", "aws-cdk")]
    errs += [f"AWS deployment config present: {c}" for c in AWS_CONFIG_FILES if (root / c).exists()]
    rep.check(11, "AWS·EC2가 활성 기술로 정의되지 않음", errs)

    return finish(rep, root, pkg, screens, args.no_snapshot)


def finish(rep: Report, root: Path, pkg: dict, screens: list[dict], no_snapshot: bool) -> int:
    for n, title, ok, errs in rep.results:
        print(f"[{'PASS' if ok else 'FAIL'}] {n:02d} {title}")
        for e in errs:
            print(f"    - {e}")
    failed = [r for r in rep.results if not r[2]]
    if failed:
        print(f"VALIDATE_INPUTS_FAIL failed={len(failed)} checks={len(rep.results)}")
        return 1

    if not no_snapshot:
        srs_text = (root / SRS_REVISED).read_text(encoding="utf-8")
        statuses = {}
        for line in srs_text.splitlines():
            m = re.match(r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|[^|]*\|\s*(IMPLEMENT|EXCLUDED)\s*\|", line)
            if m:
                statuses[m.group(1)] = m.group(2)
        app_dir = root / "src" / "app"
        manifest, _ = find_design_manifest(root)
        snapshot = {
            "harness_schema": HARNESS_SCHEMA,
            "design_token_source": DESIGN_MD,
            "design_manifest": str(manifest.relative_to(root)) if manifest else None,
            "package": {k: pkg.get(k, {}) for k in ("dependencies", "devDependencies", "scripts")},
            "src_app_tree": sorted(str(p.relative_to(root)) for p in app_dir.rglob("*") if p.is_file()),
            "starter_template_present": "To get started, edit the" in (app_dir / "page.tsx").read_text(encoding="utf-8"),
            "screens": [{k: s.get(k) for k in ("screen_id", "name", "tier", "route", "page_entry")}
                        | {"section_ids": [x.get("id") for x in s.get("sections", [])]} for s in screens],
            "requirements": {k: statuses.get(k) for k in REQ_FUNC + REQ_NF},
            "test_ids": sorted(set(re.findall(r"^\|\s*((?:UT|SMK|MAN)-\d{2}|RAC-\d{2})\s*\|", srs_text, re.M))),
        }
        out = root / "TASKS" / "INPUT_SNAPSHOT.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"snapshot: {out.relative_to(root)}")

    print(f"VALIDATE_INPUTS_PASS checks={len(rep.results)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
