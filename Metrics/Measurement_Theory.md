# Module Documentation

## Overview

This document describes the modules and components of a maternal triage system, covering input validation, priority/decision logic, queue management, and UI utilities.

---

## Input & Validation Modules

| Module/Component | Metric Performed | Scale Type | Values/Range |
|---|---|---|---|
| Gestational Age (`ga` input) | Weeks of pregnancy | Ratio | 0 to 42 (integer weeks) |
| Blood Pressure (`bp` input) | Systolic / Diastolic reading | Ratio (two separate ratio measures) | e.g., 90/60 to 180/110+ mmHg (validated as `\d{2,3}/\d{2,3}`) |
| Fetal Heart Rate (`fhr` input) | Beats per minute | Ratio | 0 to 220 bpm (often 100–170 normal range checked) |
| Symptoms (checkbox group) | Presenting complaints / clinical signs | Nominal | Unordered set: `heavy-bleeding`, `severe-pain`, `high-bp`, `reduced-movements`, `contractions`, `leaking-fluid`, `fever`, `swelling`, `blurred-vision`, `severe-vomiting`, `mild-pain` |
| Patient Name / ID (`name` input) | Identifier | Nominal / Label | Free text (e.g., "Nakato A." or "PID-2026-047") |
| Additional Notes (`notes` textarea) | Free-form clinical info | Nominal / Text | Arbitrary string (optional) |
| `validateForm()` | Form data completeness & format check | Validation – not a scale | Boolean pass/fail + error message |

---

## Priority & Decision Logic

| Module/Component | Metric Performed | Scale Type | Values/Range |
|---|---|---|---|
| `getPriority()` function | Clinical urgency / triage category | Ordinal | RED (highest) > ORANGE > YELLOW > GREEN (lowest); mapped to classes: `red`, `orange`, `yellow`, `green` |
| Priority outcome (`priority.text` & `priority.class`) | Assigned triage level & color | Ordinal + Nominal (color label) | e.g., "RED - Immediate (BSOTS Level 1: Life-threatening)" → class `"red"` |
| Symptom-based rules in `getPriority()` | Decision inputs for priority | Nominal → Ordinal mapping | Binary presence/absence of symptoms → determines ordinal priority |

---

## Queue Management & State

| Module/Component | Metric Performed | Scale Type | Values/Range |
|---|---|---|---|
| `queue` array (localStorage) | List of assessed patients | Ordered collection – time-based | Array of objects (length = number of patients in queue) |
| `queue.length` | Total patients waiting | Absolute | Non-negative integer (0 to many) |
| `patient.time` | Timestamp of triage assessment | Interval / Ratio (time) | HH:MM string (e.g., "14:35") |
| `patient.priorityClass` | Stored urgency category | Nominal (color label) | `"red"`, `"orange"`, `"yellow"`, `"green"` |
| `updateQueueStats()` | Summary counts by priority | Absolute counts per category | e.g., Total: 5 (Red: 1, Orange: 2, Yellow: 1, Green: 1) |

---

## UI & Utility Functions

| Module/Component | Metric Performed | Scale Type | Values/Range |
|---|---|---|---|
| `renderQueue()` / `queueTable` | Display of triage queue | Presentation – not a scale | Table rows (filtered/sorted) |
| `sortQueue('priority')` | Sorting by urgency | Ordinal ordering | Uses `{red:4, orange:3, yellow:2, green:1}` mapping |
| `sortQueue('time')` | Sorting by arrival time | Ratio (timestamp) | Ascending/descending via `Date.getTime()` |
| `exportQueue()` | CSV export of queue data | Data export – not a scale | CSV string with columns: `Name, ID, GA, BP, FHR, Symptoms, Notes, Priority, Time` |
| `viewPatient()` / modal | Detailed patient view | Display – aggregates previous metrics | Modal shows all stored fields + priority |
