# Software Reliability Models and Metrics
## Maternity Triage Application

---

## Overview

This document explains how the Maternity Triage web application relates to and implements concepts from Software Reliability Models and Metrics (Chapter 9, SENG 421). The application is a browser-based obstetric triage queue tool. The sections below map reliability engineering theory directly to observable structures and behaviors in the application code.

---

## 1. Failure, Fault, and Error — Core Definitions

### Concept

The chain of causation in software reliability is:

```
Error (human action) → Fault (defect in code) → Failure (observable deviation from expected behavior)
```

Only failure is directly observable during operation.

### Implementation in Code

In the triage application, the observable failure surface is the triage queue. If the priority assessment function assigns the wrong priority level to a patient, this constitutes a **failure** — the system departs from expected behavior (correct BSOTS classification) during execution.

The `formError` element represents the system's own failure reporting interface:

```html
<p id="formError" style="color: #dc3545; text-align: center; margin-top: 12px; display: none;"></p>
```

When required inputs are absent and the form is submitted, the system surfaces a failure signal. The underlying fault would be an incorrect validation branch in `script.js`. The originating error would be a developer mistakenly omitting or miswriting that validation condition.

---

## 2. Reliability Definition

### Concept

Reliability is the probability that a system functions without failure for a specified time in a specified environment.

For exponential distribution:

```
R(t) = e^(−λt)
```

Where λ is the failure intensity (failures per unit time or natural unit).

### Implementation in Code

The triage application runs in a browser environment with no server dependency. Its "natural unit" is a patient assessment session. Reliability in this context means: given a correctly filled form, the correct priority is computed and the patient is placed in the queue without error.

The application targets zero failures per session for its core workflow (assessment → queue insertion → CSV export). A reliability target of R = 0.99 for 8 hours of clinical use would translate — using the formula above — to a required λ of approximately 0.00125 failures per hour, meaning no more than roughly one incorrect priority assignment per 800 sessions.

---

## 3. Availability

### Concept

```
Availability = Uptime / (Uptime + Downtime)

Also expressed as: A = MTTF / (MTTF + MTTR) = MTTF / MTBF
```

### Implementation in Code

Because the application stores all data in the browser (no external database or API calls during triage), downtime is limited to browser crashes or tab closures. The footer documents this design decision:

```html
<footer>
  Local triage tool (BSOTS-aligned) • Data stored only in this browser • Kampala, 2026
</footer>
```

This architecture maximizes availability by eliminating network-dependent failure modes. There are no server outages, no API timeouts, and no authentication failures. The Mean Time To Repair (MTTR) for a browser refresh is under 10 seconds, which keeps availability extremely high even if failures occur.

---

## 4. Failure Intensity

### Concept

Failure intensity (λ) is the number of failures per natural unit or time unit. It is the primary way of expressing software reliability in operational terms. For a system with n components:

```
λ_system = λ₁ + λ₂ + ⋯ + λₙ
```

### Implementation in Code

The application has three independently testable functional components:

| Component | Function | Failure Mode |
|---|---|---|
| Assessment Form | Collects and validates patient data | Wrong priority assigned; missing field accepted |
| Queue Manager | Stores, sorts, searches, and displays patients | Patient lost from queue; sort order incorrect |
| Export Module | Converts queue to CSV | Malformed CSV output; data truncated |

The system-level failure intensity is the sum of failure intensities across all three components. During development, each component should be tested independently (Feature Test) before integration — directly following the recommendation that feature tests precede load tests.

---

## 5. Reliability Growth Models

### Concept

Software reliability grows over time as bugs are found and fixed. Two standard models are:

- **Basic Exponential Model (B)**: assumes finite total failures (ν₀) in infinite time
  ```
  λ(τ) = λ₀ · e^(−(λ₀/ν₀)τ)
  ```

- **Logarithmic Poisson Model (P)**: assumes infinite failures
  ```
  λ(τ) = λ₀ / (λ₀θτ + 1)
  ```

### Implementation in Code

The triage application's development followed a reliability growth pattern. Early builds had higher failure rates in the priority classification logic (the most complex component). As test sessions surfaced incorrect priority mappings, they were fixed, reducing λ over successive builds.

The `priorityBadge` and `priorityDesc` DOM elements are the observable outputs against which reliability growth can be measured:

```html
<div id="priorityBadge" class="priority-badge"></div>
<p class="priority-desc" id="priorityDesc"></p>
```

Each bug fix that corrects a wrong priority assignment reduces the failure intensity of the assessment component, contributing to measurable reliability growth across the build history.

---

## 6. Mean Time to Failure (MTTF), MTTR, and MTBF

### Concept

```
MTTF = 1 / λ          (for exponential distribution)
MTBF = MTTF + MTTR
```

MTTF represents the expected time between failures. MTTR is the mean time to repair after a failure occurs.

### Implementation in Code

For the triage application in a clinical setting (assume 40 patient assessments per 8-hour shift):

- If the assessment logic fails once per 200 sessions, then λ = 0.005 failures per session and MTTF = 200 sessions.
- Repair (MTTR) in this browser-based context means a clinician notices the incorrect priority, manually overrides via the "Clear Queue" function, and re-enters the patient:

```html
<button class="btn btn-secondary" onclick="clearQueue()">Clear Queue</button>
```

This override mechanism directly implements the repair pathway. Its existence in the interface acknowledges that failures can occur and provides a recovery route — a practical expression of MTTR minimization in the UI design.

---

## 7. Operational Profile

### Concept

An operational profile is the set of operations and their probabilities of occurrence. It is used to allocate test cases proportionally to how frequently operations are used in the field.

### Implementation in Code

The triage application has a clearly defined operational profile:

| Operation | Estimated Occurrence Probability |
|---|---|
| Submit new patient assessment | 0.55 |
| View patient details (modal) | 0.20 |
| Search queue by name or ID | 0.10 |
| Sort queue by priority or time | 0.08 |
| Export queue to CSV | 0.04 |
| Clear queue | 0.02 |
| Dismiss modal | 0.01 |

Following SRE principles, test cases should be allocated proportionally to these probabilities. The assessment submission function (0.55) should receive the majority of test effort, which aligns with its position as the most complex and failure-prone component. The `clearQueue` function (0.02) needs fewer test cases but should still be covered because it is a critical recovery operation.

---

## 8. Software Reliability Engineering (SRE) Process

### Concept

The five steps of SRE are:

1. Define necessary reliability
2. Develop operational profiles
3. Prepare for test
4. Execute test
5. Apply failure data to guide decisions

### Implementation in Code

| SRE Step | Application Artifact |
|---|---|
| Define reliability | Priority classification must achieve zero wrong assignments for 🔴 (Immediate) cases — a hard reliability requirement given patient safety implications |
| Develop operational profile | The 7-operation profile table above |
| Prepare for test | Test cases cover all four priority levels, all 11 symptom combinations, and all boundary input values |
| Execute test | Manual test sessions using the live form with scripted patient data; results observed in `queueBody` |
| Apply failure data | Priority logic in `script.js` updated when failures are identified; timestamp metadata in the queue enables failure time logging |

---

## 9. Release Criteria

### Concept

A product should be released when:

1. All acquired components pass certification testing
2. The failure intensity ratio λ/λF does not appreciably exceed 0.5 for all components

### Implementation in Code

The triage application has no acquired third-party components (no external libraries beyond the browser's native APIs), which simplifies the release gate — there is no certification test phase for acquired software.

The failure intensity objective (λF) for the priority classification engine should be set relative to clinical safety:

- For 🔴 (Immediate) cases: λF = 0 (zero tolerance for missed critical patients)
- For 🟡 (Semi-urgent) cases: λF ≤ 0.01 failures per session

Before deployment in a clinical setting, the ratio λ/λF for the critical case handler must be demonstrably at or below 0.5, meaning the observed failure rate must be no more than half the target threshold across the testing period.

---

## 10. Trend Analysis and Laplace Factor

### Concept

Trend analysis determines whether reliability is improving, stable, or declining. The Laplace factor u(i) indicates:

- u(i) < −2: reliability growth (failure intensity decreasing)
- −2 < u(i) < +2: stable reliability
- u(i) > +2: reliability decrease (failure intensity increasing)

### Implementation in Code

The queue's timestamp metadata supports trend analysis. Each patient entry records the time of assessment:

```html
<p style="text-align:center; margin: 12px 0; color:#555;">
  Patient added to queue at <span id="timestamp"></span>
</p>
```

If failure incidents (incorrect priority assignments) are logged with their timestamps across test sessions, the inter-failure times θⱼ can be computed and used to calculate the arithmetical mean τ(i) and the Laplace factor u(i). An increasing τ(i) series would confirm that fixes between test sessions are producing measurable reliability growth in the priority engine.

---

## 11. Reliability Metrics Summary

| Metric | Application Interpretation |
|---|---|
| λ (failure intensity) | Incorrect priority assignments per session |
| MTTF | Sessions between incorrect assignments |
| MTTR | Time for clinician to identify and re-enter affected patient |
| MTBF | MTTF + MTTR |
| R(t) | Probability of zero incorrect assignments across t sessions |
| A (availability) | Browser uptime fraction; approaches 1.0 due to local-only storage |
| λF for 🔴 cases | 0 (zero tolerance) |
| λF for 🟡 cases | ≤ 0.01 per session |
| Release threshold | λ / λF ≤ 0.5 across final test period |

---
