/* ============================================================
   MamaCare — Database & Utility Layer
   Uses localStorage as the persistent database
   ============================================================ */

const DB = {
  // ── Keys ────────────────────────────────
  KEYS: {
    USERS:       'mc_users',
    CURRENT:     'mc_current_user',
    ASSESSMENTS: 'mc_assessments',
    JOURNAL:     'mc_journal',
    PROFILE:     'mc_profile',
  },

  // ── Helpers ──────────────────────────────
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem(key);
  },

  // ── Auth ─────────────────────────────────
  getUsers() { return this.get(this.KEYS.USERS) || []; },

  registerUser(data) {
    const users = this.getUsers();
    if (users.find(u => u.email === data.email)) return { ok: false, msg: 'Email already registered.' };
    const user = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
    users.push(user);
    this.set(this.KEYS.USERS, users);
    return { ok: true, user };
  },

  loginUser(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Incorrect email or password.' };
    this.set(this.KEYS.CURRENT, user);
    return { ok: true, user };
  },

  logout() { this.remove(this.KEYS.CURRENT); },

  currentUser() { return this.get(this.KEYS.CURRENT); },

  requireAuth(redirectTo = 'login.html') {
    if (!this.currentUser()) { window.location.href = redirectTo; return false; }
    return true;
  },

  // ── Assessments ───────────────────────────
  getAssessments(userId) {
    const all = this.get(this.KEYS.ASSESSMENTS) || {};
    return all[userId] || [];
  },

  saveAssessment(userId, assessment) {
    const all = this.get(this.KEYS.ASSESSMENTS) || {};
    if (!all[userId]) all[userId] = [];
    const entry = { ...assessment, id: Date.now().toString(), date: new Date().toISOString() };
    all[userId].unshift(entry);
    this.set(this.KEYS.ASSESSMENTS, all);
    return entry;
  },

  deleteAssessment(userId, assessmentId) {
    const all = this.get(this.KEYS.ASSESSMENTS) || {};
    if (!all[userId]) return;
    all[userId] = all[userId].filter(a => a.id !== assessmentId);
    this.set(this.KEYS.ASSESSMENTS, all);
  },

  // ── Journal ───────────────────────────────
  getJournal(userId) {
    const all = this.get(this.KEYS.JOURNAL) || {};
    return all[userId] || [];
  },

  saveJournalEntry(userId, entry) {
    const all = this.get(this.KEYS.JOURNAL) || {};
    if (!all[userId]) all[userId] = [];
    const saved = { ...entry, id: Date.now().toString(), date: new Date().toISOString() };
    all[userId].unshift(saved);
    this.set(this.KEYS.JOURNAL, all);
    return saved;
  },

  deleteJournalEntry(userId, entryId) {
    const all = this.get(this.KEYS.JOURNAL) || {};
    if (!all[userId]) return;
    all[userId] = all[userId].filter(e => e.id !== entryId);
    this.set(this.KEYS.JOURNAL, all);
  },
};

// ── Priority Engine ─────────────────────────────────────────
const TriageEngine = {
  assess({ symptoms = [], ga = 0, bp = '', fhr = null }) {
    const bpParts = bp.split('/').map(n => parseInt(n) || 0);
    const sys = bpParts[0] || 0;
    const dia = bpParts[1] || 0;
    const reasons = [];

    // RED
    if (symptoms.includes('heavy-bleeding'))  reasons.push('Heavy vaginal bleeding');
    if (symptoms.includes('severe-pain'))     reasons.push('Severe abdominal pain');
    if (sys >= 160)                           reasons.push(`Very high systolic BP (${sys})`);
    if (dia >= 110)                           reasons.push(`Very high diastolic BP (${dia})`);
    if (fhr && (fhr < 100 || fhr > 170))     reasons.push(`Abnormal fetal heart rate (${fhr} bpm)`);
    if (symptoms.includes('unconscious'))     reasons.push('Unconscious / not responding');
    if (symptoms.includes('seizure'))         reasons.push('Seizure / convulsion');

    if (reasons.length) return { level: 'RED',    cls: 'red',    label: 'Immediate — Call for help NOW', action: 'Go to the nearest emergency room or call 911/112 immediately. Do not wait.', reasons };

    // ORANGE
    if (symptoms.includes('blurred-vision'))    reasons.push('Blurred vision / severe headache');
    if (symptoms.includes('reduced-movements')) reasons.push('Reduced fetal movements');
    if (ga < 37 && symptoms.includes('contractions')) reasons.push('Possible preterm labor');
    if (symptoms.includes('severe-vomiting'))   reasons.push('Severe vomiting / dehydration');
    if (sys >= 140 || dia >= 90)               reasons.push(`Elevated blood pressure (${bp})`);

    if (reasons.length) return { level: 'ORANGE', cls: 'orange', label: 'Urgent — See a midwife today', action: 'Contact your midwife or antenatal clinic within the next 1–2 hours.', reasons };

    // YELLOW
    if (symptoms.includes('leaking-fluid')) reasons.push('Possible waters breaking (PROM)');
    if (symptoms.includes('fever'))         reasons.push('Fever / signs of infection');
    if (symptoms.includes('mild-pain'))     reasons.push('Mild abdominal pain or cramping');
    if (symptoms.includes('swelling'))      reasons.push('Swelling of hands/face/feet');
    if (symptoms.includes('contractions') && ga >= 37) reasons.push('Regular contractions at term');

    if (reasons.length) return { level: 'YELLOW', cls: 'yellow', label: 'See someone soon', action: 'Call your midwife or visit an antenatal clinic within a few hours.', reasons };

    // GREEN
    return {
      level: 'GREEN', cls: 'green', label: 'Routine — You seem well',
      action: 'Continue monitoring. Mention this at your next antenatal visit.',
      reasons: ['No urgent symptoms detected']
    };
  }
};

// ── UI Helpers ───────────────────────────────────────────────
const UI = {
  toast(msg, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    t.innerHTML = `<span>${icons[type] || ''}</span> ${msg}`;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(120%)'; t.style.transition = 'all 0.4s'; setTimeout(() => t.remove(), 400); }, duration);
  },

  openModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  },

  initNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.topnav .nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    }
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });
  },

  fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
  },

  fmtTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  },
};

// ── Pregnancy Weeks Calculator ───────────────────────────────
function weeksFromLMP(lmpIso) {
  if (!lmpIso) return null;
  const ms = Date.now() - new Date(lmpIso).getTime();
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}

function daysUntilDue(lmpIso) {
  if (!lmpIso) return null;
  const due = new Date(new Date(lmpIso).getTime() + 280 * 24 * 60 * 60 * 1000);
  return Math.ceil((due - Date.now()) / (24 * 60 * 60 * 1000));
}
