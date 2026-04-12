## What is Software Quality?

From what I understand, software quality is about how good the program works for the people using it. Not just the code inside, but how it feels to use and whether it does what it's supposed to do. The PDF I looked at talks about external stuff - like, things you can see and feel when you're actually using the app.

## The Quality Things We Looked At

### 1. Does It Do What It's Supposed To? (Functionality)

This is basically, does the app work? For our triage thing, we need to make sure it can:
- Take patient info (name, blood pressure, pain level, etc.)
- Figure out if it's red, orange, yellow, or green priority
- Keep a list of waiting patients
- Let you search and sort the list

I think we got most of this working. Like, the priority calculation seems right based on the rules we used. But I'm not sure if we missed anything important.

### 2. Is It Reliable? (Reliability)

Reliability means it doesn't crash or mess up when you're using it. For midwives in busy hospitals, this is super important - you can't have the app failing when someone's in labor.

We tried to make it so it saves everything to the browser's storage, so even if you close it, the patient list is still there. But sometimes browsers clear that storage, so maybe it's not perfect.

We should probably count how many times it breaks or loses data. Like, keep track of errors.

### 3. Is It Easy To Use? (Usability)

This is about how easy it is for people to learn and use the app. Our users are midwives and nurses, not computer experts, so it needs to be simple.

The app has a form that's pretty straightforward - fill in the boxes, click assess. But maybe we could make it even simpler? Like, bigger buttons on phones.

I think we should ask real midwives to use it and see how long it takes them to do stuff. Also, how many mistakes they make.

### 4. Does It Run Fast Enough? (Efficiency)

Efficiency is about not wasting time or resources. The app should be quick to load and respond.

Since it's just HTML, CSS, and JavaScript, it loads pretty fast. But on old phones or slow internet, maybe not. We didn't really test that much.

We could measure how long it takes to calculate a priority or add a patient to the queue.

### 5. Can We Fix It Later? (Maintainability)

This is about how easy it is to update or fix the app when we need to. Since I'm not a pro coder, I made it with simple code, but I'm not sure if it's easy for others to understand.

The code has some comments, but not a lot. Maybe we should add more explanations. Also, if we want to add new features, like temperature or something, can we do that without breaking everything?

### 6. Does It Work Everywhere in All Environments? (Portability)

Portability means it works on different devices and browsers. We made it responsive, so it should work on phones and computers.

It works offline, which is good for places without internet. But does it work on all browsers? We tested on Chrome, but what about Safari or Firefox?

## How We Tried To Measure This Stuff


For reliability, we can count errors with a simple counter and log:
```javascript
let errorCount = 0;
function logError(errorMessage) {
  errorCount += 1;
  console.error(`Error #${errorCount}: ${errorMessage}`);
  // Optionally store in localStorage for later review
  const history = JSON.parse(localStorage.getItem('errorHistory') || '[]');
  history.push({ id: errorCount, message: errorMessage, time: new Date().toISOString() });
  localStorage.setItem('errorHistory', JSON.stringify(history));
}
```

For usability, time tasks using start and end timestamps:
```javascript
let taskStartTime = null;
function startTask() {
  taskStartTime = Date.now();
}

function endTask(taskName) {
  if (taskStartTime === null) {
    console.warn('startTask() must be called before endTask()');
    return;
  }
  const durationMs = Date.now() - taskStartTime;
  console.log(`${taskName} took ${durationMs} ms`);
  taskStartTime = null;
  // Save in localStorage for trend tracking
  const tasks = JSON.parse(localStorage.getItem('taskTimes') || '[]');
  tasks.push({ taskName, durationMs, time: new Date().toISOString() });
  localStorage.setItem('taskTimes', JSON.stringify(tasks));
}
```

These are simple, correct baseline implementations that can be expanded with real user testing and reports.

## What We Did In The App

The app is pretty basic - just three files. We didn't add any fancy quality checking because, well, I don't know how. But maybe we should.

For the metrics page we have, it's just showing code size stuff, not quality. Maybe we need a new page for quality metrics.

## Ideas For Making It Better

- Add some way to report problems or give feedback
- Test it with real users
- Make sure it works on different devices
- Add more checks to prevent mistakes
- Keep track of how it's used

## Wrapping Up

I think quality is important, especially for medical apps. We tried to make ours good, but there's probably a lot we could improve. It's not just about the code, but how well it serves the users.

