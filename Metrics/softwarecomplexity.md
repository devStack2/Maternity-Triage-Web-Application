# Investigating the Maternity Triage Application
## Measuring Internal Product Attributes (Software Complexity)
---

## Introduction

Software complexity refers to how difficult a program is to understand, maintain, test, and modify. Unlike simple software, complex software is difficult to understand and breaks with ease.

When software becomes too complex, the following happens:
- Developers struggle to maintain it
- Errors increase
- The system becomes unreliable

Therefore, software engineers measure complexity using **software metrics**.

This investigation analyses the Maternity Triage Application using internal product attribute metrics:

1. **Size Metrics** (Lines of Code)
2. **Control Flow Complexity** (Cyclomatic Complexity)
3. **Module/Structural Complexity**

The analysis focuses mainly on the following modules, which control the core logic of the triage system:

| Module | Role |
|---|---|
| `validateForm()` | Input validation |
| `getPriority()` | Patient urgency logic |
| `renderQueue()` | Queue display |
| `updateQueueStats()` | Patient counting |

---

## Metric 1: Size Metric (Lines of Code)

This metric measures how big a program is by counting its lines of code.

> **Principle:** More lines of code → more complexity. Fewer lines → simpler software.

### Application to the Maternity Triage System

The main logic lives in JavaScript modules. Below is an example of the priority logic:

```javascript
function getPriority(data) {
  if (data.systolic >= 160 || data.diastolic >= 110) {
    return RED;
  }
  if (data.symptoms.includes("heavy-bleeding")) {
    return RED;
  }
  if (data.ga < 37 && data.symptoms.includes("contractions")) {
    return ORANGE;
  }
  return GREEN;
}
```

### Size Evaluation

| Module | Approximate Code Size | Purpose |
|---|---|---|
| `validateForm()` | Medium | Handles input checking |
| `getPriority()` | Medium–Large | Contains decision rules |
| `renderQueue()` | Medium | Displays queue |
| `updateQueueStats()` | Small | Counts patients |

### Interpretation

The system has **moderate size complexity** because:
- Logic is divided into separate modules
- Each module performs one main task

This makes the system easier to maintain, debug, and extend.

---

## Metric 2: Control Flow Complexity (Cyclomatic Complexity)

Cyclomatic complexity measures how many decision paths exist in the program. Every decision statement (`if`, `else`, `switch`, `while`, `for`) increases the complexity count.

### Application to the Maternity Triage System

The `getPriority()` function determines a patient's urgency level based on the following rules:

- If high blood pressure → **RED**
- If heavy bleeding → **RED**
- If preterm contractions → **ORANGE**
- Otherwise → **GREEN**

Each rule represents one decision path.

### Simplified Decision Flow

```
Patient enters data
       ↓
Check Blood Pressure
       ↓
Check Symptoms
       ↓
Check Gestational Age
       ↓
Assign Priority
```

### Estimated Cyclomatic Complexity

| Condition | Complexity Added |
|---|---|
| Blood pressure check | +1 |
| Bleeding check | +1 |
| Contraction check | +1 |
| Final decision | +1 |
| **Estimated Total** | **≈ 4–6** |

### Interpretation

This complexity level is within the **safe range**.

| Complexity Value | Meaning |
|---|---|
| 1–10 | Simple ✅ |
| 10–20 | Moderate ⚠️ |
| > 20 | Very Complex ❌ |

The triage system's low cyclomatic complexity means:
- Testing is easier
- Debugging is easier
- The system is more reliable

---

## Metric 3: Structural Complexity (Module Interaction)

Structural complexity measures how different parts of the system depend on each other. Heavy interdependencies make a system fragile — changing one module can break others.

> **Example:** In a hospital where maternity, pharmacy, and lab all depend on one shared system, a single failure stops everything.

Good software design reduces unnecessary dependencies.

### Structure of the Triage System

The Maternity Triage Application uses a **modular pipeline design**:

```
User Input Module
       ↓
Validation Module
       ↓
Priority Decision Module
       ↓
Queue Management Module
       ↓
Display Module
```

### Module Responsibilities

| Module | Purpose |
|---|---|
| Input Module | Collects patient information |
| `validateForm()` | Checks if data is correct |
| `getPriority()` | Determines urgency level |
| Queue System | Stores patient records |
| `renderQueue()` | Displays the queue |
| `updateQueueStats()` | Counts cases by priority |

### Structural Observation

Each module has **one responsibility** (Single Responsibility Principle). This is a good design because:
- Errors are easier to locate
- Code is easier to modify
- Complexity stays controlled

---

## Data Complexity

Data complexity refers to the amount and types of data the system processes.

| Data | Type |
|---|---|
| Gestational Age | Ratio |
| Blood Pressure | Ratio |
| Fetal Heart Rate | Ratio |
| Symptoms | Nominal |
| Priority Level | Ordinal |

These variables interact to determine patient urgency:

```
Symptoms + Blood Pressure + Gestational Age → Priority Level
```

This interaction increases complexity slightly, but is **necessary for accurate medical decisions**.

### Example Rule

```javascript
if (systolic >= 160 || diastolic >= 110) {
  // Mark as RED (critical)
}
```

If the mother's blood pressure is critically high, the system immediately flags her case as **RED**. This rule reduces decision time and improves patient safety. However, each additional rule increases internal complexity — the challenge is to **balance complexity with accuracy**.

---

## Complexity Evaluation Summary

| Metric | Result | Interpretation |
|---|---|---|
| Lines of Code | Moderate | Manageable size |
| Cyclomatic Complexity | Low–Moderate | Easy to test |
| Structural Complexity | Low | Modular design |
| Data Complexity | Moderate | Due to medical variables |

---

## Benefits of Measuring Complexity

Measuring complexity helps improve the Maternity Triage System in several ways:

- **Easier Maintenance** — Developers can update medical rules without breaking the system.
- **Better Reliability** — Lower complexity reduces software bugs.
- **Improved Safety** — Critical patients are prioritised quickly.
- **Easier Testing** — Low cyclomatic complexity means fewer test cases are required.

---

## Possible Improvements

### 1. Rule Engine
Instead of hard-coding rules like `if symptom A and BP > 160`, rules could be stored in a **configurable rule system**. This would make updates easier when medical protocols change, without needing to modify source code directly.

### 2. Logging System
The system could record analytics such as:
- Number of RED cases per session
- Average patient waiting time
- Symptom frequency patterns

This would support future **empirical software analysis** and help identify trends in patient care.

---

## Conclusion

The investigation shows that the Maternity Triage Application maintains a **balanced level of internal software complexity**. The metrics applied — Size, Cyclomatic Complexity, Structural Complexity, and Data Complexity — all reflect the necessary medical logic used to assess patient risk.

Overall, the system demonstrates **good software engineering practices**, making it reliable for use in maternity clinics where quick and accurate triage decisions are critical.
