## Software Quality Enhancements (Based on ISO 9126)

This document provides a comprehensive explanation of the software quality enhancements implemented in the Maternity Triage Web Application. These enhancements are grounded in the principles of **ISO 9126**, an international standard for evaluating software quality across multiple characteristics. The goal is to ensure that the application is not only functional but also usable, reliable, efficient, and maintainable in real-world clinical settings such as Kampala’s maternity wards.

### 1. Overview of Additions

To align with ISO 9126 quality characteristics, the following additions have been made to the existing application:

- **Added `qualityMetrics.js` file** – A dedicated JavaScript module that contains functions for calculating and reporting key software quality indicators.

- **Implemented basic metrics** covering four critical quality attributes:

  - **Usability** – How easily users can interact with the triage system.

  - **Reliability** – How consistently the system performs without failure.

  - **Efficiency** – How quickly the system responds to user actions.

  - **Maintainability** – How easy it is to understand, modify, and extend the codebase.

These metrics are designed to run alongside the main triage application without interfering with its core functionality, providing ongoing insight into software quality during development and deployment.


### 2. Implemented Metrics

The following subsections describe each metric in detail, including its formula, purpose, and relevance to maternity triage operations.

#### 2.1 Usability

- **Formula**:  
`(available functions / required functions) \* 100`  
*Where "available functions" refers to implemented interactive features (e.g., patient assessment, priority sorting, export), and "required functions" refers to the intended feature set defined in the requirements.*

- **Purpose**:  
Usability measures how effectively and efficiently a user (e.g., a midwife or triage nurse) can accomplish tasks within the system. A higher usability score indicates that the system provides the necessary functions in an accessible manner, reducing training time and the risk of user error. This is especially important in busy maternity triage environments where speed and accuracy are critical.

#### 2.2 Reliability

- **Formula**:  
`(successful operations / total operations) \* 100`  
*Where a "successful operation" is any user action (form submission, queue sorting, modal display) that completes without an unhandled error or crash.*

- **Purpose**:  
Reliability reflects the system’s ability to perform its intended functions under stated conditions over time. In a medical triage context, unreliable software could lead to missed prioritization or lost patient data. This metric helps developers track error rates and ensure that the application remains stable, even with repeated or concurrent use.

#### 2.3 Efficiency

- **Measurement method**:  
Response time (in milliseconds) for key operations, such as:

  - Submitting a new patient assessment

  - Sorting the triage queue

  - Displaying patient details in the modal

- **Purpose**:  
Efficiency evaluates the system’s performance in terms of resource usage and speed. For a web-based triage tool used on potentially low-end devices or variable network conditions, fast response times ensure that clinicians are not delayed. This metric is collected passively or via performance API and can alert developers to bottlenecks (e.g., slow DOM updates or inefficient loops).

#### 2.4 Maintainability

- **Formula**:  
`(comments / lines of code) \* 100`  
*Where "comments" includes inline comments, JSDoc annotations, and explanatory notes within the source code, and "lines of code" refers to total non-empty, non-whitespace lines.*

- **Purpose**:  
Maintainability measures how easily the code can be understood, corrected, adapted, or enhanced. A higher comment-to-code ratio (within reason) improves maintainability by explaining complex logic, documenting assumptions, and guiding future developers. For a triage system that may evolve with clinical guidelines, high maintainability reduces technical debt and accelerates safe updates.


### 3. Code File Added

- **File name**: `qualityMetrics.js`

- **Location**: Same directory as `index.html`, `styles.css`, and `script.js`

- **Contents include**:

  - Function `computeUsability(available, required)`

  - Function `computeReliability(successes, totalOps)`

  - Function `measureEfficiency(operationName, startTime, endTime)`

  - Function `computeMaintainability(comments, linesOfCode)`

  - Optional helper functions to log or display these metrics via browser console or a hidden debug panel.

These functions are written in plain JavaScript and do not require external libraries. They can be called manually during testing or integrated into the application’s lifecycle hooks for continuous monitoring.


### 4. How to Use

To begin collecting and evaluating software quality metrics for the Maternity Triage Application, follow these steps:

1. **Include the script** in your HTML file (e.g., `index.html`).  
Add the following line just before the closing `\</body\>` tag or inside the `\<head\>` section after other scripts:

2. **Call the metric functions** at appropriate points in your application logic.  
For example:

   - After a patient assessment is successfully submitted, increment the reliability counter.

   - When the page loads, calculate maintainability by analyzing the script content.

   - Before and after sorting the queue, record efficiency timestamps.

3. **View the results** in the browser’s developer console, or extend the script to display metrics on a dedicated dashboard (e.g., `metrics.html`).  
Example console output:

text

```
Usability: 95%

Reliability: 99.8%

Efficiency (sort queue): 124ms

Maintainability: 18%
```

4. **Interpret the metrics** to guide improvements:

   - Low usability → Add missing features or improve UI labels.

   - Low reliability → Fix error-prone operations and add validation.

   - Poor efficiency → Optimize DOM manipulation or reduce reflows.

   - Low maintainability → Refactor complex code and add comments.

By integrating these ISO 9126-aligned metrics into your development workflow, you can systematically enhance the quality of the Maternity Triage Web Application, ensuring it remains a dependable tool for obstetric emergency care 

