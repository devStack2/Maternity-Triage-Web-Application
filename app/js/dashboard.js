/* ============================================================
   MamaCare — Dashboard JavaScript
   ============================================================ */

// ── Auth guard ───────────────────────────────────────────────
if (!DB.requireAuth('login.html')) { /* redirected */ }

const user = DB.currentUser();

// ── Week tips by trimester / week ───────────────────────────
const WEEK_TIPS = [
  { weeks: [4,7],  icon:'🤢', title:'First signs', text:'Nausea is very common right now. Try eating small meals every 2-3 hours and keep dry crackers nearby for the morning.' },
  { weeks: [8,12], icon:'💓', title:'Heartbeat!', text:'Your baby\'s heart is beating! This is also when morning sickness usually peaks. Stay hydrated and rest when you can.' },
  { weeks: [13,16],icon:'🎉', title:'2nd Trimester begins', text:'The risk of miscarriage drops significantly now. Many mamas start feeling much better. Energy often returns!' },
  { weeks: [17,20],icon:'👋', title:'First movements!', text:'You may soon feel your baby move for the first time — like little bubbles or flutters. This is called quickening.' },
  { weeks: [21,24],icon:'👂', title:'Baby can hear you', text:'Talk, read and sing to your baby — they can hear your voice now! Your bond is already growing.' },
  { weeks: [25,28],icon:'👀', title:'Eyes opening', text:'Your baby is opening their eyes and developing sleep cycles. Try to rest at similar times each day.' },
  { weeks: [29,32],icon:'🧠', title:'Brain development', text:'Your baby\'s brain is growing fast. Omega-3 foods like fish and groundnuts support this development.' },
  { weeks: [33,36],icon:'🌀', title:'Getting into position', text:'Baby is moving into birth position. You may feel more pressure in your pelvis — this is normal.' },
  { weeks: [37,40],icon:'🌟', title:'Almost time!', text:'You\'re full term! Pack your hospital bag if you haven\'t already. Know your route to the facility.' },
];

const REMINDERS = [
  { icon:'💊', text:'Take your folic acid, iron and calcium supplements today.' },
  { icon:'💧', text:'Drink 8–10 glasses of water throughout the day.' },
  { icon:'🦟', text:'Sleep under a treated mosquito net tonight.' },
  { icon:'🚶', text:'A gentle 20-minute walk is great for you and baby.' },
  { icon:'📞', text:'Keep your midwife\'s number saved and easy to reach.' },
  { icon:'🥬', text:'Eat leafy greens today — sukuma wiki, spinach or amaranth.' },
  { icon:'😴', text:'Try to sleep on your left side tonight to improve circulation.' },
  { icon:'🗓️', text:'Remember to attend all your antenatal clinic appointments.' },
];

// ── Tab navigation ───────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link[data-tab]').forEach(l => l.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  const link = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
  if (link) link.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Refresh relevant tab
  if (tabId === 'home')     renderHome();
  if (tabId === 'history')  renderHistory();
  if (tabId === 'journal')  renderJournal();
}

document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchTab(link.dataset.tab);
    document.querySelector('.topnav .nav-links').classList.remove('open');
  });
});

// ── Logout ───────────────────────────────────────────────────
function handleLogout() {
  DB.logout();
  window.location.href = 'login.html';
}

// ── Home Tab ─────────────────────────────────────────────────
function renderHome() {
  // Nav greeting
  document.getElementById('navGreeting').textContent = 'Hi, ' + user.firstName + ' 💛';

  // Pregnancy progress
  const weeks = weeksFromLMP(user.lmp);
  const daysLeft = daysUntilDue(user.lmp);
  const bannerWeeks = document.getElementById('bannerWeeks');
  const bannerSub   = document.getElementById('bannerSub');
  const bannerDue   = document.getElementById('bannerDue');

  if (weeks !== null && weeks >= 0 && weeks <= 45) {
    const trimester = weeks <= 12 ? '1st Trimester' : weeks <= 27 ? '2nd Trimester' : '3rd Trimester';
    bannerWeeks.textContent = `Week ${weeks}`;
    bannerSub.textContent   = trimester;
    if (daysLeft !== null && daysLeft > 0) {
      bannerDue.textContent = `🗓 ${daysLeft} days until your due date`;
    } else if (daysLeft !== null && daysLeft <= 0) {
      bannerDue.textContent = `🌟 Your due date has passed — baby may arrive any moment!`;
    }
    // Progress ring
    const pct = Math.min(100, Math.round((weeks / 40) * 100));
    const circumference = 289;
    document.getElementById('ringFill').style.strokeDashoffset = circumference - (circumference * pct / 100);
    document.getElementById('ringPct').textContent = pct + '%';

    // Stats
    document.getElementById('statWeeks').textContent = weeks;
    document.getElementById('statDays').textContent  = daysLeft !== null && daysLeft > 0 ? daysLeft : '🌟';

    // Week tip
    const tipData = WEEK_TIPS.find(t => weeks >= t.weeks[0] && weeks <= t.weeks[1]) || WEEK_TIPS[WEEK_TIPS.length - 1];
    document.getElementById('tipTitle').textContent = tipData.icon + ' ' + tipData.title;
    document.getElementById('tipText').textContent  = tipData.text;
  } else {
    bannerWeeks.textContent = 'Your Journey';
    bannerSub.textContent   = 'Update your LMP in your profile to see your progress.';
  }

  // Assessments count
  const assessments = DB.getAssessments(user.id);
  document.getElementById('statChecks').textContent  = assessments.length;
  document.getElementById('statJournal').textContent = DB.getJournal(user.id).length;

  // Last assessment
  const lastAssess = document.getElementById('lastAssessCard');
  const noLastAssess = document.getElementById('noLastAssess');
  if (assessments.length > 0) {
    const a = assessments[0];
    lastAssess.style.display = 'flex';
    noLastAssess.style.display = 'none';
    lastAssess.innerHTML = `
      <div>
        <div class="section-label-sm" style="margin-bottom:2px;">${UI.fmtDate(a.date)} · ${UI.fmtTime(a.date)}</div>
        <div style="font-size:0.9rem; color:var(--muted); margin-top:4px;">Week ${a.ga || '?'} · BP: ${a.bp || '?'}</div>
      </div>
      <span class="priority-pill ${a.result.cls}">${a.result.level}</span>
      <div style="font-size:0.88rem; color:var(--muted); flex:1;">${a.result.action}</div>
    `;
  } else {
    lastAssess.style.display = 'none';
    noLastAssess.style.display = 'block';
  }

  // Reminders (shuffle daily)
  const dayIdx = new Date().getDay();
  const todayReminders = [...REMINDERS].sort((a,b) => (a.icon+dayIdx > b.icon+dayIdx ? 1 : -1)).slice(0, 4);
  document.getElementById('remindersList').innerHTML = todayReminders.map(r =>
    `<div class="reminder-item">${r.icon} ${r.text}</div>`
  ).join('');
}

// ── Symptom Checker ──────────────────────────────────────────
document.getElementById('triageForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const ga  = parseInt(document.getElementById('ga').value) || null;
  const bp  = document.getElementById('bp').value.trim() || '0/0';
  const fhr = parseInt(document.getElementById('fhr').value) || null;
  const symptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(c => c.value);
  const notes = document.getElementById('notes').value.trim();

  // Validation
  const errEl = document.getElementById('err-ga');
  if (!ga || ga < 4 || ga > 42) {
    errEl.textContent = 'Please enter your gestational age (4–42 weeks).';
    errEl.classList.add('show');
    return;
  }
  errEl.classList.remove('show');

  // Normalise BP
  const bpVal = /^\d{2,3}\/\d{2,3}$/.test(bp) ? bp : '0/0';
  const result = TriageEngine.assess({ symptoms, ga, bp: bpVal, fhr });

  // Save
  const saved = DB.saveAssessment(user.id, { ga, bp, fhr, symptoms, notes, result });

  // Show result
  document.getElementById('assessForm').style.display = 'none';
  const rc = document.getElementById('resultCard');
  rc.className = 'result-card ' + result.cls;
  rc.style.display = 'block';

  document.getElementById('resultPriority').className = 'result-priority ' + result.cls;
  document.getElementById('resultPriority').textContent = result.level;
  document.getElementById('resultLabel').textContent  = result.label;
  document.getElementById('resultAction').textContent = result.action;
  document.getElementById('resultReasons').innerHTML  = result.reasons.map(r =>
    `<span class="reason-tag">${r}</span>`
  ).join('');

  UI.toast('Assessment saved! 🌿', 'success');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Highlight checkboxes
  document.querySelectorAll('.check-item').forEach(item => {
    if (item.querySelector('input:checked')) item.classList.add('checked');
  });
});

function resetChecker() {
  document.getElementById('triageForm').reset();
  document.querySelectorAll('.check-item').forEach(i => i.classList.remove('checked'));
  document.getElementById('assessForm').style.display = 'block';
  document.getElementById('resultCard').style.display = 'none';
}

// ── History ──────────────────────────────────────────────────
let historyFilter = 'all';
let historySearch = '';

function renderHistory(filter = historyFilter, search = historySearch) {
  historyFilter = filter;
  historySearch = search;

  let assessments = DB.getAssessments(user.id);
  if (filter !== 'all')  assessments = assessments.filter(a => a.result.cls === filter);
  if (search) {
    const q = search.toLowerCase();
    assessments = assessments.filter(a =>
      (a.result.level || '').toLowerCase().includes(q) ||
      (a.notes || '').toLowerCase().includes(q) ||
      UI.fmtDate(a.date).toLowerCase().includes(q)
    );
  }

  const list  = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');

  if (assessments.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = assessments.map(a => `
    <div class="hist-item ${a.result.cls}" onclick="openDetail('${a.id}')">
      <span class="priority-pill ${a.result.cls}" style="font-size:0.85rem; padding:7px 16px;">${a.result.level}</span>
      <div class="hist-info">
        <div style="font-weight:600; font-size:0.95rem;">${a.result.label}</div>
        <div class="hist-date">Week ${a.ga || '?'} · BP: ${a.bp || '?'} · ${UI.fmtDate(a.date)} at ${UI.fmtTime(a.date)}</div>
      </div>
      <div class="hist-actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm btn-outline" onclick="openDetail('${a.id}')">View</button>
        <button class="btn btn-sm btn-danger" onclick="deleteAssessment('${a.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Filter pills
document.querySelectorAll('.fpill').forEach(pill => {
  pill.addEventListener('click', function() {
    document.querySelectorAll('.fpill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    renderHistory(this.dataset.filter, historySearch);
  });
});

document.getElementById('historySearch').addEventListener('input', function() {
  renderHistory(historyFilter, this.value);
});

function openDetail(id) {
  const all = DB.getAssessments(user.id);
  const a   = all.find(x => x.id === id);
  if (!a) return;
  document.getElementById('detailModalBody').innerHTML = `
    <div class="detail-row"><strong>Date:</strong> ${UI.fmtDate(a.date)} at ${UI.fmtTime(a.date)}</div>
    <div class="detail-row"><strong>Priority:</strong> <span class="priority-pill ${a.result.cls}" style="font-size:0.85rem; padding:6px 14px;">${a.result.level}</span></div>
    <div class="detail-row"><strong>Guidance:</strong> ${a.result.action}</div>
    <div class="detail-row"><strong>Weeks pregnant:</strong> ${a.ga || 'Not entered'}</div>
    <div class="detail-row"><strong>Blood pressure:</strong> ${a.bp || 'Not recorded'}</div>
    <div class="detail-row"><strong>Fetal heart rate:</strong> ${a.fhr ? a.fhr + ' bpm' : 'Not recorded'}</div>
    <div class="detail-row"><strong>Notes:</strong> ${a.notes || 'None'}</div>
    <div class="detail-reasons">
      <strong>Reasons identified:</strong><br>
      <div style="margin-top:8px;">${a.result.reasons.map(r => `<span class="reason-tag">${r}</span>`).join('')}</div>
    </div>
    ${a.symptoms && a.symptoms.length > 0 ? `<div class="detail-row mt-2"><strong>Symptoms logged:</strong> ${a.symptoms.map(s => s.replace(/-/g,' ')).join(', ')}</div>` : ''}
  `;
  UI.openModal('detailModal');
}

function deleteAssessment(id) {
  if (!confirm('Delete this assessment?')) return;
  DB.deleteAssessment(user.id, id);
  renderHistory();
  UI.toast('Assessment deleted.', 'info');
}

function exportHistory() {
  const assessments = DB.getAssessments(user.id);
  if (!assessments.length) { UI.toast('No assessments to export.', 'warning'); return; }
  let csv = 'Date,Priority Level,Guidance,Weeks,BP,FHR,Symptoms,Notes\n';
  assessments.forEach(a => {
    csv += `"${UI.fmtDate(a.date)} ${UI.fmtTime(a.date)}","${a.result.level}","${a.result.action}",${a.ga || ''},"${a.bp || ''}",${a.fhr || ''},"${(a.symptoms||[]).join('; ')}","${a.notes || ''}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `mamacare_assessments_${new Date().toISOString().split('T')[0]}.csv`;
  link.click(); URL.revokeObjectURL(url);
  UI.toast('Exported successfully! 📊', 'success');
}

// ── Journal ──────────────────────────────────────────────────
let selectedMood = '';

document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    selectedMood = this.dataset.mood;
    document.getElementById('jMood').value = selectedMood;
  });
});

document.getElementById('journalForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('jTitle').value.trim();
  const text  = document.getElementById('jText').value.trim();
  const week  = parseInt(document.getElementById('jWeek').value) || null;
  const mood  = selectedMood;

  if (!text) { UI.toast('Please write something before saving.', 'warning'); return; }

  DB.saveJournalEntry(user.id, { title: title || 'My entry', text, week, mood });
  UI.toast('Journal entry saved! 💛', 'success');
  this.reset();
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  selectedMood = '';
  renderJournal();
});

function renderJournal() {
  const entries = DB.getJournal(user.id);
  const list  = document.getElementById('journalList');
  const empty = document.getElementById('journalEmpty');

  if (!entries.length) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = entries.map(e => `
    <div class="j-card" onclick="openJournalEntry('${e.id}')">
      <div class="j-card-head">
        <div>
          <div class="j-card-title">${e.title || 'My entry'}</div>
          ${e.week ? `<div style="font-size:0.78rem;color:var(--rose-deep);font-weight:600;">Week ${e.week}</div>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          ${e.mood ? `<span class="j-card-mood">${e.mood.split(' ')[0]}</span>` : ''}
          <button class="j-del-btn" onclick="event.stopPropagation(); deleteJournal('${e.id}')">🗑</button>
        </div>
      </div>
      <div class="j-card-date">${UI.fmtDate(e.date)} · ${UI.timeAgo(e.date)}</div>
      <div class="j-card-preview">${e.text.slice(0,120)}${e.text.length > 120 ? '…' : ''}</div>
    </div>
  `).join('');
}

function openJournalEntry(id) {
  const e = DB.getJournal(user.id).find(x => x.id === id);
  if (!e) return;
  document.getElementById('jModalTitle').textContent = e.title || 'My Entry';
  document.getElementById('journalModalBody').innerHTML = `
    <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px; flex-wrap:wrap;">
      ${e.mood ? `<span style="font-size:1.4rem;">${e.mood.split(' ')[0]}</span>` : ''}
      <span style="font-size:0.82rem; color:var(--muted);">${UI.fmtDate(e.date)} · ${UI.fmtTime(e.date)}</span>
      ${e.week ? `<span class="badge" style="background:var(--blush);color:var(--rose-deep);">Week ${e.week}</span>` : ''}
    </div>
    <p style="line-height:1.8; color:var(--charcoal); white-space:pre-wrap;">${e.text}</p>
  `;
  UI.openModal('journalModal');
}

function deleteJournal(id) {
  if (!confirm('Delete this journal entry?')) return;
  DB.deleteJournalEntry(user.id, id);
  renderJournal();
  UI.toast('Entry deleted.', 'info');
}

// ── Wellbeing ─────────────────────────────────────────────────
// Water glasses
let waterGlasses = 0;
function renderWater() {
  document.getElementById('waterTracker').innerHTML = Array.from({length:8}, (_,i) =>
    `<button class="glass ${i < waterGlasses ? 'filled' : ''}" onclick="toggleGlass(${i})" title="Glass ${i+1}">💧</button>`
  ).join('');
  document.getElementById('waterCount').textContent = waterGlasses + ' / 8 glasses';
}
function toggleGlass(idx) {
  waterGlasses = idx < waterGlasses ? idx : idx + 1;
  renderWater();
}
renderWater();

// Sleep slider
document.getElementById('sleepSlider').addEventListener('input', function() {
  document.getElementById('sleepVal').textContent = this.value + ' hrs';
  const pct = (this.value / 12) * 100;
  this.style.background = `linear-gradient(to right, var(--rose-deep) 0%, var(--rose-deep) ${pct}%, var(--border) ${pct}%)`;
});

// Group button selections
function initGroupBtns(containerId) {
  document.querySelectorAll(`#${containerId} .apt-btn`).forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll(`#${containerId} .apt-btn`).forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
}
initGroupBtns('appetiteBtns');
initGroupBtns('activityBtns');
initGroupBtns('movBtns');

function saveWellbeing() {
  const appetite = document.querySelector('#appetiteBtns .apt-btn.active')?.dataset.val || null;
  const activity = document.querySelector('#activityBtns .apt-btn.active')?.dataset.val || null;
  const movement = document.querySelector('#movBtns .apt-btn.active')?.dataset.val || null;
  const sleep    = document.getElementById('sleepSlider').value;
  const water    = waterGlasses;

  // Store in journal as a wellbeing log
  DB.saveJournalEntry(user.id, {
    title: '🌿 Wellbeing Check-In',
    text: `Water: ${water}/8 glasses | Sleep: ${sleep}hrs | Appetite: ${appetite || 'not logged'} | Activity: ${activity || 'not logged'} | Baby movements: ${movement || 'not logged'}`,
    week: weeksFromLMP(user.lmp),
    mood: null,
    type: 'wellbeing'
  });

  UI.toast('Wellbeing check-in saved! 🌿', 'success');
  // Reset
  waterGlasses = 0; renderWater();
  document.getElementById('sleepSlider').value = 7;
  document.getElementById('sleepVal').textContent = '7 hrs';
  document.querySelectorAll('.apt-btn').forEach(b => b.classList.remove('active'));
}

// ── Initial render ───────────────────────────────────────────
UI.initNav();
renderHome();
renderJournal();
renderHistory();
