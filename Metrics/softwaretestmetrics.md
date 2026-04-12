# Software Test Metrics
## Maternity Triage Application

---

## Overview

This document explains how the Maternity Triage web application implements concepts drawn from Software Test Metrics (Chapter 10, SENG 421). The application performs Quick Obstetric Priority Assessment and uses a browser-based queue management system. Below, each relevant test metric concept is mapped directly to code structures and behaviors within the application.

---

## 1. Test Case Specification

### Concept
A test case is an instance of a use case composed of a set of test inputs, execution conditions, and expected results. Before specifying test cases, use cases must be documented.

### Implementation in Code

The triage form serves as the primary use case. Each field represents a direct input variable:

```html
<input type="text" id="name" placeholder="e.g. Nakato A. or PID-2026-047" required>
<input type="number" id="ga" min="0" max="42" placeholder="e.g. 32" required>
<input type="text" id="bp" placeholder="e.g. 140/90" required>
<input type="number" id="fhr" min="0" max="220" placeholder="e.g. 145">
```

Each symptom checkbox represents a **direct input variable** — values that control the triage logic directly. The `min` and `max` attributes on number fields define the **boundary conditions** for those variables (e.g., gestational age 0 to 42 weeks, fetal heart rate 0 to 220 bpm).

---

## 2. Estimating Number of Test Cases

### Concept
The number of test cases is constrained by both time and cost. The formula selects the minimum of:

- **Time-based**: (available time × available staff) / (average time per test case)
- **Cost-based**: available budget / (average cost per test case)

### Implementation in Code

The symptom checkbox group contains **11 symptom options**, representing 11 distinct direct input variables. Using equivalence class logic, the minimum set of test cases covers each symptom category (critical, urgent, non-urgent) without redundancy:

```html
<label class="checkbox-label"><input type="checkbox" name="symptom" value="heavy-bleeding"> 🔴 Heavy vaginal bleeding</label>
<label class="checkbox-label"><input type="checkbox" name="symptom" value="severe-pain"> 🔴 Severe abdominal pain</label>
<label class="checkbox-label"><input type="checkbox" name="symptom" value="high-bp"> 🟠 Severe headache / high BP symptoms</label>
<!-- ...and so on -->
```

The color-coded icons (🔴 🟠 🟡 🟢) group symptoms into **equivalence classes** — tests within the same color class are expected to produce the same priority outcome. This directly reduces the total number of test cases needed while preserving coverage.

---

## 3. Equivalence Classes

### Concept
A group of test cases is equivalent if they test the same operation and if one detects a bug, the others likely will too.

### Implementation in Code

The four priority levels (Immediate, Urgent, Semi-urgent, Non-urgent) define four equivalence classes of triage output. Any symptom combination within the 🔴 class maps to "Immediate" regardless of which specific 🔴 symptom triggered it. This means:

- One test with `heavy-bleeding` is representative of all 🔴 inputs.
- One test with `contractions` is representative of all 🟡 inputs.

The `assess priority` logic in `script.js` operationalizes this by checking symptom categories rather than individual symptoms — a direct implementation of equivalence-based test reduction.

---

## 4. Boundary Conditions

### Concept
Programs that fail with non-boundary values also tend to fail at boundaries. Boundary testing checks whether inequality conditions are handled correctly.

### Implementation in Code

Blood pressure parsing involves boundary logic. The input `140/90` is the clinical threshold separating normal from hypertensive states. The code must correctly parse and compare the systolic and diastolic components at exactly this boundary. Similarly:

```html
<input type="number" id="ga" min="0" max="42" ...>
```

A gestational age of `0` and `42` are boundary values. The HTML attribute enforcement tests that inputs outside these bounds are rejected, while values exactly at 0 and 42 are accepted — matching the boundary condition test case pattern.

---

## 5. Visible State Transitions

### Concept
Every interaction causes a program state change. Tests should cover likely user paths (activity diagram) and settings that propagate effects elsewhere (statechart diagram).

### Implementation in Code

The application has two primary visible states:

```html
<div class="card" id="assessmentCard">...</div>
<div class="card" id="dashboardCard" style="display:none;">...</div>
```

State transitions are:

| State | Trigger | Next State |
|---|---|---|
| Assessment Form visible | Submit valid form | Dashboard / Queue visible |
| Dashboard visible | Click "New Assessment" | Assessment Form visible |
| Queue empty | First patient added | Queue table visible |
| Patient row visible | Click "View" | Modal overlay visible |
| Modal visible | Click "×" | Modal hidden |

Each of these transitions corresponds to a visible state test path that should be exercised during testing.

---

## 6. Test Coverage Metrics

### Concept

Coverage types include:

- **Statement coverage (CVs)**: fraction of statements tested
- **Branch coverage (CVb)**: fraction of decision branches tested
- **GUI coverage (CVGUI)**: fraction of GUI elements tested by at least one test case

### Implementation in Code

The GUI elements available for coverage measurement include:

| GUI Element | Count |
|---|---|
| Text input fields | 3 (name, ga, bp) |
| Number input fields | 1 (fhr) |
| Checkboxes | 11 (symptom options) |
| Textarea | 1 (notes) |
| Submit button | 1 |
| Sort buttons | 2 |
| Search input | 1 |
| Export button | 1 |
| Clear button | 1 |
| New Assessment button | 1 |
| Modal close button | 1 |

Total GUI elements: approximately 24. Full **GUI coverage** requires at least one test case activating each element.

Branch coverage applies to the priority logic: every symptom category combination (🔴 only, 🟠 only, 🔴 + 🟠 combined, no symptoms, etc.) must be tested to achieve full branch coverage of the assessment function.

---

## 7. Test Pass, Failure, and Pending Rates

### Concept

- **Test Pass Rate (Rtp)**: proportion of test cases producing expected output
- **Test Failure Rate (Rtf)**: proportion producing unexpected output
- **Test Pending Rate (Rtpend)**: proportion that could not be executed or verified

### Implementation in Code

The form validation provides a built-in failure detection mechanism:

```html
<p id="formError" style="color: #dc3545; ...display: none;"></p>
```

When required fields are missing (name or bp or ga), the form prevents submission and shows an error — a test case passes if the correct error is shown, and fails if submission is allowed without required fields. The pending state applies when browser compatibility prevents execution (e.g., certain mobile browsers not supporting the number input range enforcement).

---

## 8. Remaining Defects Measurement

### Concept
By seeding known faults and measuring detection rates, the total remaining defects can be estimated:

```
Nd = (nd / ns) × Ns
Nr = (Nd − nd) + (Ns − ns)
```

### Implementation in Code

This concept applies during testing of the triage priority algorithm. If known incorrect priority assignments (seeded faults) are deliberately introduced into the assessment logic and a test suite detects a subset of them, the total number of undetected logic errors in the priority function can be estimated. The `queueBody` DOM element accumulates all assessed patients, making it straightforward to compare expected vs. actual priority assignments across a batch test run — directly supporting the seeded-fault defect estimation process.

---

## 9. Software Testability

### Concept
A software system is testable if built-in test (BIT) mechanisms can be activated from the external interface.

### Implementation in Code

The application exposes all state through visible DOM elements, making it externally testable without instrumentation:

```html
<div id="priorityBadge" class="priority-badge"></div>
<p class="priority-desc" id="priorityDesc"></p>
<span id="timestamp"></span>
```

These elements are independently determinable (ID-BCS) — their values depend only on the direct inputs provided through the form. This gives the application a **high test controllability (TC)** score, meaning any automated or manual test can directly observe the output state after each input without needing access to internal program variables.

---

## Cost Metrics Summary

| Metric | Application Element |
|---|---|
| Test case count estimate | 11 symptom classes × 4 priority levels = up to 44 combinations; equivalence reduction targets ~10 representative cases |
| GUI coverage target | 24 GUI elements requiring at least one test each |
| Branch coverage target | Priority decision tree: minimum 6 branches (one per priority level combination) |
| Boundary values | GA: 0 and 42 weeks; FHR: 0 and 220 bpm; BP systolic: 140 mmHg threshold |
| Testability score (TC) | High — all outputs observable through named DOM elements without internal access |

---
