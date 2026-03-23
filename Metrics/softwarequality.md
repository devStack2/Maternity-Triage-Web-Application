# Maternity Triage Tool: Software Quality Implementation

## Overview

This document explains how the Maternity Triage web application implements the principles of external software quality measurement as defined by major quality models including McCall's Model, ISO 9126, and Boehm's Model. Each quality characteristic described in software metrics theory is addressed through concrete design and implementation decisions in the codebase.

---

## What Is Software Quality?

Software quality is defined under ISO 9126 as the totality of features and characteristics of a software product that bear on its ability to satisfy stated or implied needs. In this application, those needs are clinical: midwives and triage nurses at a maternity unit need a fast, reliable, and easy to use tool that correctly prioritises patients by obstetric risk.

Quality is observed from two angles throughout this system:

**Conformance to requirements** means the tool does what it was specified to do. Every patient entered must receive a priority classification aligned with BSOTS (Birmingham Symptom-specific Obstetric Triage System) guidelines. Any deviation from that is treated as a defect.

**Fitness for use** means the tool meets real user expectations in a clinical environment. A technically correct but slow or confusing interface would still be a quality failure.

---

## Software Quality Models Applied

### McCall's Model

McCall's model organises quality into factors, criteria, and metrics. The three main factor groups are:

**Product Operation** covers correctness, reliability, efficiency, integrity, and usability. This application targets all five through its priority scoring logic, local browser storage, lightweight DOM operations, role based access separation, and simplified one page form layout.

**Product Revision** covers maintainability, flexibility, and testability. The codebase separates concerns: `script.js` handles logic, `styles.css` handles presentation, and `index.html` handles structure. Each function in `script.js` handles one responsibility, making individual units easy to test and replace.

**Product Transition** covers portability, reusability, and interoperability. The application uses no server dependencies and runs entirely in the browser, making it portable across devices including low resource clinic computers and Android tablets.

### Boehm's Model

Boehm's model adds an emphasis on as-is utility and maintainability as a software lifecycle concern. This tool was designed for immediate deployment without installation, matching the as-is utility criterion. The use of standard HTML, CSS, and vanilla JavaScript ensures that future developers at any skill level can maintain or extend the system.

### ISO 9126 Quality Characteristics

ISO 9126 defines six top level quality characteristics. Each is implemented in this application as described below.

---

## ISO 9126 Characteristics and Implementation

### 1. Functionality

Functionality measures whether the software provides the right set of functions to meet stated needs and whether those functions work correctly.

The triage form captures the core clinical inputs: patient name or ID, gestational age in weeks, blood pressure, fetal heart rate, and a structured symptom checklist. The symptom options are colour coded and mapped to obstetric risk categories before being submitted. The assessment function in `script.js` processes these inputs and assigns a priority tier. The system also supports queue management, search, sort, CSV export, and patient detail review, all of which are core functional requirements for a triage coordinator role.

Suitability is demonstrated by the alignment to BSOTS categories. Accuracy is demonstrated by deterministic scoring: the same inputs always produce the same priority output with no randomness or ambiguity.

### 2. Reliability

Reliability measures how well software maintains its level of performance under stated conditions over a period of time. Sub-characteristics include maturity, fault tolerance, and recoverability.

The application stores all queue data in the browser's local storage, meaning data persists through page refreshes without a network call that could fail. Validation is applied to required fields before assessment is triggered, and an error message is displayed inline rather than crashing the interface. The form error element (`formError`) is shown conditionally and cleared on each new attempt, preventing stale error states from misleading the user.

Because there is no server, there is no server downtime to account for. The fault surface is limited to the local device and browser, which are entirely within the clinic's control.

### 3. Usability

Usability measures how easy and comfortable the software is to learn and use. Sub-characteristics include understandability, learnability, and operability.

The interface presents one task at a time. The assessment form is the default view. After submission, the queue view takes over. Navigation between these two views is explicit: a single button labelled "New Assessment" returns the clinician to the form. There are no menus, no tabs, and no hidden states.

Symptoms are listed with emoji colour indicators (🔴 for emergency, 🟠 for urgent, 🟡 for semi-urgent, 🟢 for non-urgent) drawn directly from BSOTS colour coding conventions, which clinical staff already recognise. This reduces training time and cognitive load.

The modal for patient details uses a close button marked with a large `×` symbol in the top right corner, following established UI conventions. The search input and sort buttons sit above the queue table in a familiar toolbar layout.

The footer link to the metrics page is intentionally small and secondary, keeping the clinical interface uncluttered during use.

### 4. Efficiency

Efficiency measures the relationship between the software's level of performance and the resources used under stated conditions.

The application loads no external libraries, no CDN scripts, and no fonts beyond system defaults. The entire application is three files: one HTML file, one CSS file, and one JavaScript file. This means the tool loads instantly even on a slow or unstable clinic network, and it continues to function fully without any internet connection after the first load.

DOM operations are performed only when necessary. The queue table is hidden when empty and rendered only when at least one patient exists. Sorting and searching filter the existing in-memory queue rather than re-fetching from any storage layer.

### 5. Maintainability

Maintainability measures how easily the software can be modified to correct faults, improve performance, or adapt to a changed environment. Sub-characteristics include analysability, changeability, stability, and testability.

The triage scoring logic is isolated in a single clearly named function. Priority descriptions and their associated CSS classes are defined as return values within that function, meaning a change to the clinical criteria requires editing one function in one file with no cascading effects on the UI or storage layers.

The CSS uses a limited set of named classes with consistent naming conventions (`.priority-badge`, `.card`, `.btn`, `.modal`). Adding a new priority tier or redesigning a card requires no structural changes to the HTML or JavaScript.

The separation of the metrics page (`metrics.html`) from the clinical interface means that software quality documentation can be updated independently of the operational tool.

### 6. Portability

Portability measures how easily the software can be transferred from one environment to another. Sub-characteristics include adaptability, installability, and replaceability.

There is no installation. A clinician opens the HTML file in any modern browser and the tool is ready. It has been tested and functions identically on Chrome, Firefox, and Chromium-based browsers on both desktop and mobile. The responsive layout defined in `styles.css` adapts to screen sizes from a smartphone display up to a widescreen monitor.

Because all data is stored in the browser rather than on a remote server, the application can be deployed by simply copying three files to a USB drive or a shared network folder. No database configuration, no server setup, and no user account provisioning is required.

---

## Software Quality Assurance (SQA) Alignment

The IEEE 730 standard for Software Quality Assurance Plans defines SQA as an activity that audits software products and processes against defined standards and brings deviations to management's attention.

In this project, SQA activities are built into the development workflow:

**Documentation standards** are met through this README, inline HTML comments, and the linked metrics page. Each document describes what the system does, how to use it, and how it was evaluated.

**Design standards** are met by the separation of HTML structure, CSS presentation, and JavaScript behaviour. No inline styles or inline event handlers appear in the markup except where dynamically injected by the script, and each dynamic injection is clearly labelled.

**Code standards** are met by consistent use of `const` and `let` over `var`, descriptive function and variable names, and early return patterns that keep conditional nesting shallow.

**Review and audit** procedures are represented by the software metrics page, which records quality measurements taken on the delivered system.

---

## Total Quality Management (TQM) Principles

Following Deming's model of continuous improvement, this application was designed around the following TQM essentials:

Studying user needs came first. The target users are midwives and triage nurses in a resource-constrained clinical environment. Their need is speed, legibility, and zero tolerance for ambiguity in priority output.

Continuously improving the development process means the codebase is structured so that any future iteration (adding a new symptom, changing a priority threshold, or adding a new export format) can be made safely without breaking existing functionality.

Using measurements to back decisions is demonstrated through the software metrics page linked in the application footer, which records quantitative evaluations of the delivered system's quality characteristics.

---

## Summary Table

| ISO 9126 Characteristic | Implementation in This Tool |
|---|---|
| Functionality | BSOTS-aligned scoring, queue management, CSV export, patient detail modal |
| Reliability | Local storage persistence, form validation, no server dependency |
| Usability | Colour-coded symptoms, single task view, familiar modal conventions |
| Efficiency | No external dependencies, instant load, in-memory queue operations |
| Maintainability | Isolated scoring logic, separated CSS classes, modular file structure |
| Portability | No installation required, runs in any modern browser, USB deployable |

---

## References

Boehm, B. W., Brown, J. R., and Lipow, M.: Quantitative evaluation of software quality, International Conference on Software Engineering, 1976.

ISO 9126-1:2001: Software engineering, Product quality, Part 1: Quality model.

McCall, J. A., Richards, P. K., and Walters, G. F.: Factors in Software Quality, National Technical Information Service, 1977.

IEEE 730-2002: IEEE Standard for Software Quality Assurance Plans.

Kan, S. H.: Metrics and Models in Software Quality Engineering, 2nd Edition, Addison-Wesley, 2002.
