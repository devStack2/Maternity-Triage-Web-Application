# Maternity Triage Web Application

## Overview
A lightweight, **completely offline** maternity triage tool designed for midwives, nurses, and maternity staff — especially useful in busy or resource-limited settings like health facilities in Uganda.

The app allows quick entry of patient details and symptoms → automatically calculates a color-coded priority level → maintains a local queue of waiting patients.

**No internet needed** after first load.  
**No login, no server, no database** — just three simple files.

## Features
- Mobile-friendly & responsive design
- Simple form for patient info + common maternity/obstetric symptoms
- Automatic priority assignment (Red / Orange / Yellow / Green) based on simplified BSOTS/MFTI-inspired rules
- Persistent patient queue stored in the browser (survives refresh / reopen)
- View, remove, sort, search and export queue to CSV
- Clean, modern interface with color-coded priority badges
- Patient detail modal for quick review
- Works fully offline once files are saved

## How to Use

### Option A – Recommended (cleaner folder structure)
1. Create a folder called `maternity-triage`
2. Save the three files inside it:
   - `index.html`
   - `styles.css`
   - `script.js`
3. Double-click `index.html` to open in any modern browser (Chrome, Firefox, Edge, Safari…)

### Option B – Single-file fallback (if you prefer)
- Just copy the **original single-file version** (everything in one HTML file) and save as `maternity-triage.html`

### Daily workflow
1. Open the app on a tablet/phone/laptop at the start of shift
2. Enter each new patient:
   - Name/ID, gestational age, BP, fetal heart rate (optional), symptoms
   - Click **Assess Priority**
3. Patient is automatically added to the queue with priority & timestamp
4. Sort by priority or time, search by name, view details, remove when seen
5. Export to CSV at end of shift if needed
6. Clear queue when appropriate (confirm dialog protects against mistakes)

## Priority Levels (Simplified Rules)
| Level   | Color   | Main Triggers (any of these)                              | Suggested Action              |
|---------|---------|------------------------------------------------------------|-------------------------------|
| RED     | Red     | Heavy bleeding, severe pain, BP ≥160/110, abnormal FHR     | Immediate – call doctor now   |
| ORANGE  | Orange  | High BP symptoms, reduced movements, preterm contractions  | Urgent – see within 10–15 min |
| YELLOW  | Yellow  | Leaking fluid, fever, mild pain                            | Prompt – see within 30–60 min |
| GREEN   | Green   | No red/orange flags – routine concern                      | Non-urgent / standard care    |

→ These are **simplified rules** inspired by BSOTS, MFTI and similar obstetric triage systems.  
**Always apply clinical judgment** and follow your facility’s official protocols.

## Important Notes
- **Data privacy** — Everything is stored **only in the browser** (localStorage). Nothing is sent anywhere.
- **Not certified medical software** — This is a simple decision-support aid/tool. It is **not** a replacement for training, experience, or official guidelines.
- **Browser-specific data** — The queue is saved per browser/device. Clearing browser data or using incognito mode will delete the queue.
- **Sharing** — Send the entire folder (or zip it) via USB, WhatsApp, email, etc.

## Customization Ideas
You can easily modify the behavior by editing these files:

- **`script.js`**  
  - Change priority logic → edit the `getPriority()` function  
  - Add/remove symptoms in the form submission logic  
  - Add new fields (e.g. temperature, pulse, urine dipstick)  
  - Add print functionality for the queue

- **`styles.css`**  
  - Change colors (`:root` variables)  
  - Adjust layout, fonts, spacing for tablets/phones

- **`index.html`**  
  - Add more form fields  
  - Change labels, instructions, or add facility logo

## Folder Structure (recommended)
maternity-triage/
├── index.html     ← main file – open this
├── styles.css     ← all styling
└── script.js      ← logic & priority rules


## Made with care
© 2026 – For maternity teams in Kampala and beyond  
Thank you for the vital work you do every day.

Questions, bug reports, or feature suggestions?  
Feel free to modify the code or reach out.

---------------------------------------------
Stay safe & strong 
