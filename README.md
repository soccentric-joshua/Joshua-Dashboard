# Joshua-Dashboard

## Project Summary

Joshua-Dashboard is the operator-console repository for viewing Joshua devices,
test modules, runs, logs, reports, and live execution state. The implementation
is centered in `webui/`, a Next.js package with workspace pages and shared UI
code. Repository documentation identifies dashboard views for the main
workspace, modules, runs, live run details, logs, reporting, and AI/LLM
operations. The console communicates with Joshua-Server’s REST API and its
server-sent event streams; the checked-in API inventory in
`docs/WEB_FINDINGS.md` is the authoritative local reference for those routes.

The repository also contains Python contract tests for smoke behavior, runs,
settings, and streaming, plus Vitest tests for live-run state reduction and
utility behavior. Those tests are valuable evidence that the repository has a
validation boundary, but they do not by themselves prove that every browser
page renders correctly against a running server. `docs/req.md` captures the
original product requirements, while `docs/AUDIT.md` records independent
findings and should be read alongside the implementation. Makefiles and the
web package metadata provide the available install, development, build, and
test entry points. Because the former README was only a TODO and the repository
contains both UI and contract-test layers, this inventory deliberately marks
some browser and backend integration details as partial or unknown instead of
claiming completion from filenames alone. Manual checks remain open for every
feature, especially authenticated navigation, SSE reconnection, and visual
behavior at operator display sizes.

## Feature Inventory

| # | Name / Description | Implemented? | Test Coverage? | Manual Test |
|---:|---|---|---|---|
| 1 | Next.js web UI package under `webui/` | Implemented | Partial; package tests and contract tests exist | [ ] Manual verification required |
| 2 | Workspace/dashboard view | Implemented | Partial; smoke contract coverage | [ ] Manual verification required |
| 3 | Module listing and module detail views | Implemented | Unknown | [ ] Manual verification required |
| 4 | Runs listing and run detail views | Implemented | Covered by `contract-tests/tests/test_02_runs.py` | [ ] Manual verification required |
| 5 | Live run state and streaming display | Implemented | Partial; `webui/lib/live-run/reducer.test.ts` and streaming contract test | [ ] Manual verification required |
| 6 | Logs view and live log consumption | Partial | Covered at API contract level; browser behavior unknown | [ ] Manual verification required |
| 7 | Reporting view | Implemented | Unknown | [ ] Manual verification required |
| 8 | AI/LLM view | Implemented | Unknown | [ ] Manual verification required |
| 9 | REST API integration with Joshua-Server | Implemented | Covered in `docs/WEB_FINDINGS.md` contract scope | [ ] Manual verification required |
| 10 | Server-sent event integration | Partial | Covered by `contract-tests/tests/test_04_streaming.py` | [ ] Manual verification required |
| 11 | Settings/configuration workflow | Implemented | Covered by `contract-tests/tests/test_03_settings.py` | [ ] Manual verification required |
| 12 | Dashboard utility and state helper tests | Implemented | Covered by `webui/lib/utils.test.ts` and reducer tests | [ ] Manual verification required |
| 13 | Container/Makefile development workflow | Implemented | Unknown | [ ] Manual verification required |
| 14 | Responsive and accessibility behavior | Unknown | Unknown | [ ] Manual verification required |

## Test References

```bash
cd contract-tests && pytest
cd webui && npm test
```

The exact package scripts should be confirmed in `webui/package.json` before
running the second command. See `docs/req.md`, `docs/WEB_FINDINGS.md`, and
`docs/AUDIT.md` for requirements and known limitations.
- [docs/req.md](docs/req.md) — original design/build prompt for the Web UI.
- [docs/WEB_FINDINGS.md](docs/WEB_FINDINGS.md) — verified Server REST/SSE API inventory.
- [docs/AUDIT.md](docs/AUDIT.md) — independent verification audit of this repo.
- [.claude/skills/dashboard-architecture/SKILL.md](.claude/skills/dashboard-architecture/SKILL.md) — architecture, frontend/backend communication, and UI conventions for coding agents.
