# 🌸 MamaCare — Your Pregnancy Companion

## Overview

**MamaCare** is a beautiful, warm, and empowering web application built for **pregnant mothers** — not medical staff. It gives every mama in Uganda (and beyond) a personal digital companion for her pregnancy journey: a symptom checker, a daily journal, a wellbeing tracker, and week-by-week guidance — all in one safe, private space.

> "Growing a human is the most extraordinary thing you will ever do."

**No internet needed after first load.**  
**Private by design — all data stored securely in your browser.**  
**Completely free.**

---

## ✨ What's New (vs. original)

This is a **complete redesign** focused on pregnant mothers rather than clinical staff:

| Feature | Original | MamaCare |
|---|---|---|
| Target user | Nurses / midwives | Pregnant mothers |
| Authentication | None | Full login & signup |
| UI Design | Functional / clinical | Warm, beautiful, mother-centered |
| Profiles | None | Full profile with LMP, due date, facility |
| Pregnancy progress | None | Week counter, due date, progress ring |
| Symptom checker | Staff tool | Plain-language guidance for mothers |
| Journal | None | ✅ Full pregnancy journal with moods |
| Wellbeing tracker | None | ✅ Water, sleep, appetite, movement |
| Week-by-week tips | None | ✅ Trimester-aware tips & baby milestones |
| History | Basic queue | ✅ Full searchable history with filters |
| Landing page | None | ✅ Beautiful landing page |
| Export | CSV | ✅ CSV with all assessment details |
| Responsive | Partial | ✅ Fully responsive, mobile-first |
| Reminders | None | ✅ Daily health & nutrition reminders |

---

## 📁 File Structure

```
app/
├── index.html          ← Landing page (start here)
├── login.html          ← Login page
├── signup.html         ← Signup / registration page
├── dashboard.html      ← Main app (home, checker, history, journal, wellbeing)
├── css/
│   ├── styles.css      ← Global shared styles (design system)
│   ├── landing.css     ← Landing page styles
│   ├── auth.css        ← Login & signup styles
│   └── dashboard.css   ← Dashboard & all tabs
└── js/
    ├── db.js           ← Database layer (localStorage), triage engine, utilities
    └── dashboard.js    ← All dashboard interactivity
```

---

## 🚀 How to Use

### Quick start
1. Download or clone the `mamacare/` folder
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
3. Click **"Get Started Free"** to create your account
4. Fill in your name, email, password, and **Last Menstrual Period (LMP)** date
5. You're in! MamaCare calculates your pregnancy week and due date automatically.

### No server needed
Just open the HTML files locally. Everything works offline after the first load (Google Fonts require internet on first visit; all other features are offline-ready).

---

## 🩺 How the Symptom Checker Works

1. Go to the **Symptom Checker** tab
2. Enter your current gestational age (weeks pregnant)
3. Enter your blood pressure if you know it (e.g. `120/80`)
4. Tick any symptoms you're experiencing
5. Press **"Check My Symptoms"**

You'll receive a **clear, coloured result** telling you exactly what to do:

| Colour | What it means | What to do |
|---|---|---|
| 🔴 **RED** | Life-threatening emergency | Go to emergency right now |
| 🟠 **ORANGE** | Urgent concern | Contact your midwife today |
| 🟡 **YELLOW** | Needs attention soon | See a midwife within a few hours |
| 🟢 **GREEN** | All looks well | Monitor and mention at next visit |

Every assessment is automatically saved to your history.

---

## 📓 Pregnancy Journal

Write freely — feelings, milestones, worries, happy moments. Each entry records:
- A title (e.g. "Felt baby kick for the first time! 😭")
- Your mood (Great / Good / Okay / Low / Hard day)
- Free text
- Your current week

Entries are private and stored only on your device.

---

## 🌿 Wellbeing Tracker

Log your day with simple taps:
- **Water** — track how many glasses you've drunk (8 is the goal)
- **Sleep** — how many hours last night
- **Appetite** — poor / fair / good / great
- **Activity** — resting / light / moderate
- **Baby movements** — none felt / a few / normal / very active

Plus built-in tips on nutrition, rest, and antenatal care tailored for Ugandan mothers.

---

## 🔒 Privacy & Data

- **All data is stored only in your browser** (localStorage)
- Nothing is sent to any server or third party
- Each user's data is stored under their account within your browser
- Clearing browser data / using incognito mode will delete all saved data
- **Never share devices** with other people if you want to keep your data private

---

## 📱 Responsive Design

MamaCare works beautifully on:
- 📱 Mobile phones (Android and iOS)
- 📟 Tablets
- 💻 Laptops and desktops

---

## 🛠 Customisation

### Change priority logic
Edit `TriageEngine.assess()` in `js/db.js`

### Add week tips
Edit the `WEEK_TIPS` array in `js/dashboard.js`

### Change colours / fonts
Edit CSS variables in `css/styles.css` (`:root` block)

### Add more wellbeing fields
Extend the wellbeing section in `dashboard.html` and `js/dashboard.js`

---

## ⚕️ Important Disclaimer

MamaCare is a **personal companion tool** to help you understand your symptoms and know when to seek care. It is **not** a medical device, not certified medical software, and **does not replace** your midwife, doctor, or any official medical advice.

**Always:**
- Attend all your antenatal clinic (ANC) appointments
- Follow the instructions of your midwife and doctor
- Call emergency services or go to your nearest health facility if you feel seriously unwell

---

## 🌍 Built For

Pregnant mothers in **Kampala, Uganda** — and everywhere.  
Inspired by BSOTS and MFTI obstetric triage principles, but rewritten for mothers in plain, warm language.

---

## Made with love
© 2026 MamaCare — For every mama on her journey.  
Built in Kampala, Uganda. 💛

---

*Questions, ideas or suggestions? The code is yours to modify freely.*  
*Stay strong, Mama. You've got this. 🌸*
