# Maternity Triage Web Application

## Overview

A lightweight, **completely offline** maternity triage tool built for midwives, nurses, and maternity staff — especially useful in busy or resource-limited settings like health facilities in Uganda.

The app lets you quickly enter patient details and symptoms → calculates a color-coded priority level → keeps a local queue of waiting patients.

**No internet needed** after first load.  
**No login, no server, no external files** — just one HTML file.

## Features

- Single-file HTML (easy to share via USB, email, WhatsApp, etc.)
- Mobile-friendly & responsive design
- Simple form for patient info + common maternity symptoms
- Automatic priority assignment (Red / Orange / Yellow / Green)
- Persistent queue stored in browser (survives page refresh / reopen)
- Remove patients or clear queue when done
- Clean, modern look with color-coded badges

## How to Use

1. **Get the app**  
   Save the code as `maternity-triage.html`

2. **Open it**  
   Double-click the file or open in Chrome / Firefox / Edge / Safari (any modern browser)

3. **Assess a patient**  
   - Fill name/ID, gestational age, BP, fetal heart rate, symptoms  
   - Click **Assess Priority**  
   - See result → patient added to queue automatically

4. **View & manage queue**  
   - See list of waiting patients with priority & time  
   - Remove patient after handling  
   - Clear queue at shift end if needed

5. **Offline mode**  
   Works fully without internet once opened once  
   Data stays on the device/browser you’re using

## Priority Levels (Simplified Rules)

| Level   | Color   | Triggers (any of these)                                  | Suggested Action         |
|---------|---------|----------------------------------------------------------|--------------------------|
| RED     | Red     | Heavy bleeding, BP systolic ≥160, abnormal FHR (<100 or >170 bpm) | Immediate (call doctor now) |
| ORANGE  | Orange  | Severe pain, high BP symptoms, preterm labor signs       | Urgent – see within 10–15 min |
| YELLOW  | Yellow  | Reduced fetal movements, leaking fluid, fever/infection  | Prompt – see within 30–60 min |
| GREEN   | Green   | No red flags / routine concern                           | Non-urgent / routine care |

→ These are **basic rules** inspired by obstetric triage systems (MFTI, BSOTS, etc.).  
**Always use your clinical judgment** and follow your facility’s protocols.

## Important Notes

- **Data privacy**: Everything stays in **your browser only** (localStorage) — not sent anywhere
- **Not medical software**: This is a simple aid/tool — **not certified**, not a replacement for training or guidelines
- **Customization**: Edit the JavaScript `getPriority()` function to match your local danger signs or protocols
- **Sharing**: Just send the `.html` file — no installation needed

## Customization Ideas

In the `<script>` section you can:

- Add more symptoms checkboxes
- Change colors (`:root` variables at top of `<style>`)
- Add fields (temperature, pulse, etc.)
- Modify priority thresholds
- Add a print button for queue

## Made with care

© 2026 Team One – Kampala, Uganda  
For maternity teams doing important work every day.

Stay safe & thank you for what you do!  
Questions or improvements? Feel free to modify or reach out.
