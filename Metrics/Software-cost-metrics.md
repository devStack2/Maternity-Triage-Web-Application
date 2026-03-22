# INVESTIGATING THE MATERNITY TRIAGE APPLICATION USING SOFTWARE COST METRICS
---
## Introduction
Software cost metrics refer to techniques used to estimate how much it will cost to develop, maintain, and improve a software system. This cost includes effort, time, and resources required.
Unlike simple software systems, complex systems require more effort, more time, and more resources. When cost is not properly estimated, the following problems occur:
-	Projects exceed budget 
-	Deadlines are missed 
-	Systems become unreliable
  
Therefore, software engineers use software cost metrics to manage and control development.
In this investigation, we analyse the Maternity Triage Application using software cost metrics such as:
-	Size-Based Metrics (Lines of Code) 
-	Effort-Based Metrics (Person-Month) 
-	Algorithmic Cost Estimation (COCOMO) 
-	Productivity Metrics 
-	Cost Drivers
  
These metrics help determine how expensive the system is internally.
The analysis focuses on key modules:
-	validateForm() 
-	getPriority() 
-	renderQueue() 
-	updateQueueStats() 
-	sortQueue() 

# Metric 1: Size-Based Cost Metrics (Lines of Code)
This metric measure how big a system is by counting the number of lines of code which means that;
“The more the lines of code, the higher the cost.”

#### Application to the Maternity Triage System
```The main logic exists in JavaScript. Example Code:
if (systolic >= 160 || diastolic >= 110) {
   return RED;
}
```

Size Evaluation
Estimated system size:
-	HTML ≈ 150 lines 
-	CSS ≈ 200 lines 
-	JavaScript ≈ 600 lines
  
  Therefore; The total ≈ 1000 LOC (1 KLOC)
That means that the system has moderate size cost because:
-	logic is divided into modules 
-	each module performs one task
   
This makes:
-	development easier 
-	maintenance manageable 
-	cost controlled 
However, adding more medical rules increases size and cost.

# Metric 2: Effort-Based Metrics (Person-Month)
Effort measures how much work developers must do.

Formula
Effort = Number of Developers × Time

Application to the System
Tasks include:
-	validation logic 
-	priority decision logic 
-	UI development 
-	testing 

Example Code:

``if (!bpRegex.test(bp)) {
   return error;
}
``

Effort Estimation
-	2 developers 
-	2 months 
 Effort = 4 person-months

Meaning that;
Effort increases when:
-	more validation rules are added 
-	decision logic becomes complex 
The system has moderate effort cost.

# Metric 3: Algorithmic Cost Estimation (COCOMO)
COCOMO estimates effort and time mathematically.


Project Type
 Maternal triage is an Organic Project since it is characterized by the following parameters which include
      The system being small with a small team and a moderate complexity)
      
 Its Size is 
 1 KLOC
 

Then for the Effort Calculation (EC)
Effort = 2.4 × (KLOC)^1.05
Effort = 2.4 × (1)^1.05 = 2.4 person-months

Time Calculation
Time = 2.5 × (Effort)^0.38
Time ≈ 3.5 months

Team Size
Team Size = Effort / Time ≈ 1 developer

Adjusted Real Estimate
Due to medical complexity:
-	Effort = 3–4 person-months 
-	Time = 3–4 months 
-	Team = 1–2 developers 

Interpretation
Although the system is small, the cost increases due to medical accuracy requirements

# Metric 4: Productivity Metrics
Productivity measures efficiency.

Formula
Productivity = Output / Effort

Example
1000 LOC / 4 person-months = 250 LOC/month

Interpretation
The system shows moderate productivity because:
-	logic is complex 
-	validation is required 

# Metric 5: Cost Drivers
Cost drivers are factors that increase or reduce cost.

Application to the System
1. Medical Logic
symptoms.includes('heavy-bleeding')

2. Validation Rules
if (!bpRegex.test(bp))

3. Reliability Requirements
For our system to be reliable, it must be accurate and shoukd.

4. User Interface
For the system to have an appealing UI, it must be simple and fast.

### Interpretation
These factors increase real system cost beyond basic estimates and should therefore be put into maximum consideration.

Final Evaluation
After applying all cost metrics, below was the outcome:

Metric	Result

Size	Moderate

Effort	Moderate

COCOMO	Low base, higher real

Productivity	Moderate

Cost Drivers	High impact

# Conclusion
The maternity triage application has a manageable development cost, but its cost is mainly driven by the following that is decision logic, validation, medical reliability rather than size alone.
The system demonstrates good design and can be effectively maintained and improved.

