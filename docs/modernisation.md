# One‑Local Modernisation – Formal Technical Report

*Prepared June 2 2025 by G (tech lead) with AI‑generated analysis*

---

## 1  Executive Summary

The legacy One‑Local mobile/web codebase contains **8.1 M lines across 65 k files**, negligible tests, and thousands of linting errors.  Dependency drift (80 major‑version lags) plus the absence of CI makes iterative refactor untenable.  A controlled **“rebuild‑in‑place”** using a Turborepo monorepo, Storybook design‑system, and Expo Router will reach parity faster, reduce risk, and unlock future features.  This plan details:

* Data‑driven *Refactor vs Rebuild* analysis (Section 3)
* Recommended architecture & tooling (Section 4)
* Five‑phase implementation pipeline with explicit quality gates (Section 5)
* **Full AI prompt catalogue**—copy‑paste ready—for v0, Augment, Claude Code, and Windsurf (Section 6)

---

## 2  Current Codebase Snapshot (June 2025)

| Metric               | Value                                                                  |                                            |
| -------------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| Total LOC            | **≈ 650 000** (source files only)                                      |                                            |
| Tech‑Debt Indicators | ESLint crashes (error code 1) on first pass; unknown error count       |                                            |
| Test Coverage        | 0 % (Jest mis‑configured)                                              |                                            |
| Dependency Age       | 80 packages ≥1 major version behind; RN 0.73→0.79, React 18→19, TS 4→5 |                                            |
|                      | Component–Design Parity                                                | *Not yet measured* (Augment audit pending) |

*Note: Original 8.1 M LOC count included generated and third‑party build artefacts. Filtered CLOC (excluding node\_modules, build outputs, Pods, etc.) shows \~650 k source lines across \~4.8 k files.*

---

## 3  Decision Analysis – Refactor vs Rebuild

**Heuristic:** `ComponentMatch < 40 % OR TechDebt > 7/10 → Rebuild`
*Tech‑Debt rating* exceeds 7/10; coverage is zero.  Even if component match were high, risk remains large.  **Recommendation: Rebuild UI layer** while salvaging isolated business logic modules.

### ROTI Matrix

| Factor              | Refactor  | Rebuild | Advantage |
| ------------------- | --------- | ------- | --------- |
| Dev hours (UI only) | 450–600 h | 300 h   | Rebuild   |
| Hidden‑bug risk     | Very high | Medium  | Rebuild   |
| Delivery velocity   | Slow      | Faster  | Rebuild   |
| Long‑term maint.    | Poor      | Clean   | Rebuild   |

---

## 4  Recommended Architecture & Toolchain

### 4.1  Turborepo Monorepo

* Single repo with `apps/web`, `apps/mobile`, `packages/ui`, `packages/api`, `packages/utils`.
* Zero‑install caching speeds CI.

### 4.2  Storybook + Chromatic

* Component source‑of‑truth; visual regression tests as gate.
* Design tokens generated from Figma via **v0**.

### 4.3  Expo Router & React Native

* File‑system routing mirrors Next.js; easy sharing of screens.
* Deploy mobile via EAS + TestFlight / Play Console.

### 4.4  API Gateway & “Strangler Fig” Backend 2.0

* Kong routes old vs new endpoints; micro‑services replace legacy incrementally.

### 4.5  AI Toolchain Roles

| Tool            | Role                                                               |
| --------------- | ------------------------------------------------------------------ |
| **v0**          | Figma → design tokens & starter components                         |
| **Augment**     | Static analysis / component mapping                                |
| **Claude Code** | Automated code generation & refactor; Storybook CI loop            |
| **Windsurf**    | Shell‑level orchestration; deep repo forensics; long‑running tasks |

### 4.6  CI/CD Stack

* GitHub Actions → lint → unit tests → Chromatic → build images → deploy to **Fly.io** (staging).
* Danger bot enforces merge gates.

---

## 5  Implementation Pipeline & Gates

### Phase 0  Design Freeze & Tokens

*Action*: Duplicate Figma as `v0-freeze`; export JSON & snapshots.
*Gate A*: Chromatic diff ≤ 2 px all screens.

### Phase 1  Component Build (Claude Code)

*Action*: Generate/repair React components in `packages/ui`.
*Gate B*: Storybook green; unit tests pass.

### Phase 2  Code Audit (Augment)

*Action*: Produce `component_map.md` covering 100 % of design components.
*Gate C*: Map completeness.

### Phase 3  Backend Harness (Claude Code)

*Action*: Dockerise legacy backend; React‑Admin harness; Jest API tests.
*Gate D*: Tests pass ≥80 % coverage.

### Phase 4  Integration & Deployment

*Merge repos; Expo build; staging smoke‑tests.*
*Gate E*: Staging passes Lighthouse & K6 baselines.

---

## 6  AI Prompt Catalogue

Copy prompts *verbatim*; each is standalone.

### 6.1  v0 Prompts

**System Prompt – v0**

```
You are v0, a design‑to‑code generator.
Only process screens listed in allowed_screens.json.
Input: figma_export.json, snapshots/original/*
Output: design_tokens.js (Style‑Dictionary), Storybook stories (Tailwind).
Abort if you detect a component not on the list.
```

**Prompt‑A – Generate Tokens**

```
Task: Create design_tokens.js in Style‑Dictionary format from figma_export.json.
Include colours, spacing, radii, typography.
```

**Prompt‑B – Build Storybook Stories**

```
Task: For every component node in figma_export.json
‑ Create a React component under packages/ui
‑ Add *.stories.tsx using Tailwind classes and design tokens
‑ Run `yarn chromatic --exit-zero-on-changes`
‑ If diff > 0, fix component & rerun.
Stop when all diffs = 0.
```

### 6.1.3  Prompt-C – Auto‑Fill Missing Screens

```
Context: Only 50–80 % of screens have explicit redesigns in Figma.
Task: For each route present in legacy routing files but missing in figma_export.json:
1. Inspect existing Storybook components & design tokens; infer layout.
2. Generate provisional screen files in:
   • apps/web/pages/<route>.tsx
   • apps/mobile/app/<route>.tsx
   Use ONLY atomic components and tokens.
3. Add a Storybook story variant titled `<Route> – generated`.
4. Append to docs/missing_designs.md: `route | generated | design_needed | notes`.
Repeat until no missing routes remain.
```

### 6.2  Augment Prompts

**System Prompt – Augment**

```
You are Augment, a static‑analysis agent.
Goal: Map existing React/React‑Native components to the Storybook design spec.
Output: docs/component_map.md with columns
  component_name | location | matches_design? | required_fixes
```

**Prompt‑C – Generate Map**

```
Scan apps/web, apps/mobile, packages/ui.
Compare each component's rendered output (Storybook) against design tokens.
Populate component_map.md. Use "no_match" for missing components.
```

### 6.3  Claude Code Prompts

**System Prompt – Claude Code (global)**

```
You are Claude Code with full repository permissions (see settings.local.json).
Respect lint rules and Storybook tests.  Small PRs only.
```

**Prompt‑E – Implement Component**

```
Component: <COMPONENT_NAME>
Reference: design_tokens.js, snapshots/original
Goal: Implement or refactor component in packages/ui/<COMPONENT_NAME>.
After change, run `yarn chromatic --exit-zero-on-changes` and `yarn test`.
If either fails, fix and repeat.
```

**Prompt‑G – Backend Harness**

```
Task: Containerise legacy backend (Dockerfile + docker-compose).
Expose 8080.
Generate a React‑Admin dashboard hitting every endpoint in openapi.yaml.
Add Jest tests (success + 4xx paths) with coverage ≥80 %.
```

### 6.4  Windsurf Deep‑Audit Prompt

**System Prompt – Windsurf**

```
You are Windsurf, an autonomous bash‑capable AI with unlimited execution time.
Objective: Produce a *filtered* and *deep* “State‑of‑Repo” report for One‑Local.
Directories to **exclude** from all counts: node_modules, ios/Pods, android/build, build, dist, .expo, .next, coverage, .turbo.

Steps:
1. Install tools globally (if missing): cloc, eslint, npm‑check‑updates, jest, lighthouse-ci, plato (for JS complexity).
2. Run `cloc --exclude-dir=node_modules,ios/Pods,android/build,build,dist,.expo,.next,coverage,.turbo .` → save as cloc.json.
3. Run `npx eslint . -f json -o eslint.json --max-warnings=100000`.
4. Run `npm outdated --json > outdated.json`.
5. Attempt `npm test -- --coverage --json --outputFile=coverage.json`; if Jest fails, capture log to jest-errors.txt.
6. Generate JS complexity report with `plato -r -d complexity-report src` (limit to app src) and archive directory.
7. If web app builds, run `lhci autorun --collect.url=http://localhost:3000 --output-dir=lhci` (spin up dev server first).
8. Bundle all artefacts into `analysis-bundle.zip` with a README.md summarising:
   • Filtered LOC per language
   • Top 20 eslint rule violations with counts
   • Count & severity of outdated packages
   • Test coverage % (or reason for failure)
   • Cyclomatic complexity summary (average, worst‑offenders)
   • Lighthouse performance, accessibility, best‑practices scores
9. Print the Markdown summary to STDOUT and provide the absolute path to analysis-bundle.zip.

Deliverables: STDOUT report + path to analysis-bundle.zip
```

You are Windsurf, an autonomous bash‑capable AI with unlimited execution time.
Objective: Produce a comprehensive “State‑of‑Repo” report for One‑Local.
Steps:

1. Install tools: cloc, eslint, npm‑check‑updates, jest, lighthouse‑ci.
2. Run cloc at repo root → save cloc.json.
3. Run `npx eslint . -f json -o eslint.json`.
4. Run `npm outdated --json > outdated.json`.
5. Attempt `npm test -- --coverage --json --outputFile=coverage.json`.
6. If Jest fails, capture the error log to jest‑errors.txt.
7. Bundle results into /analysis‑bundle with README.md summarising:
   • LOC per language
   • Top 20 eslint rule violations with counts
   • Count & severity of outdated packages
   • Test coverage % (or reason for failure)
   • Lighthouse perf on apps/web (if runnable)
8. Print the Markdown summary to STDOUT.
   Deliverables: analysis‑bundle zip path + STDOUT report.

```

---
## 7  Project Timeline (Aggressive)
| Week | Milestone |
|---|---|
| 0 | Phase 0 complete (Gate A) |
| 1 | Phase 1 skeleton components pass Gate B |
| 2 | Augment map & Gate C |
| 3 | Backend harness & Gate D |
| 4 | Web parity; mobile shells ship to internal TestFlight |
| 6 | Public beta (web + mobile) |

---
## 8  Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Design drift | Locked tokens + Chromatic diff PR gate |
| Legacy API surprises | Harness tests + Strangler gateway |
| AI hallucinated edits | PR size limits; required CI |
| On‑device regressions | Expo E2E Detox tests pre‑release |

---
## 9  Appendices
### A  Metrics Table (raw JSON paths)
* cloc.json
* eslint.json
* outdated.json
* coverage.json / jest‑errors.txt

### B  ROTI Calculation Details
See Section 3 spreadsheet (available in project drive).

---
_End of report_

```
