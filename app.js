/**
 * ACCA F3 Quiz — Application Logic
 * ==================================
 * Depends on: accounts.js (ACCOUNTS), questions.js (QUESTIONS)
 * All screens are divs in index.html, shown/hidden via .active class.
 */

// ── CONSTANTS ──────────────────────────────────────────────────────

// ── LOCAL STORAGE ───────────────────────────────────────────────────

const STORAGE_KEY = 'acca_f3_progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { topics: {}, overall: { attempted: 0, correct: 0 } };
  } catch (e) {
    return { topics: {}, overall: { attempted: 0, correct: 0 } };
  }
}

function saveProgress(answers) {
  const p = loadProgress();
  answers.forEach(({ question, correct }) => {
    p.overall.attempted++;
    if (correct) p.overall.correct++;
    const t = question.topic;
    if (t) {
      if (!p.topics[t]) p.topics[t] = { attempted: 0, correct: 0 };
      p.topics[t].attempted++;
      if (correct) p.topics[t].correct++;
    }
  });
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {}
}

function getOverallAccuracy() {
  const p = loadProgress();
  if (!p.overall.attempted) return null;
  return Math.round(p.overall.correct / p.overall.attempted * 100);
}

function getTopicAccuracy(topic) {
  const t = loadProgress().topics[topic];
  if (!t || !t.attempted) return null;
  return { pct: Math.round(t.correct / t.attempted * 100), attempted: t.attempted };
}

const TOPIC_NAMES = {
  'basic-double-entry':   'Basic Double Entry',
  'inventory':            'Inventory (IAS 2)',
  'nca-depreciation':     'NCA & Depreciation',
  'accruals':             'Accruals',
  'prepayments':          'Prepayments',
  'irrecoverable-debts':  'Irrecoverable Debts',
  'nca-disposal':         'NCA Disposal',
  'allowance-receivables':'Allowance for Receivables',
  'provisions':           'Provisions (IAS 37)',
  'sales-tax':            'Sales Tax / VAT',
  'nca-revaluation':      'NCA Revaluation',
  'correction-of-errors': 'Correction of Errors',
  'financial-statements': 'Financial Statements',
  'control-accounts':     'Control Accounts',
  'bank-reconciliation':  'Bank Reconciliation',
  'company-accounts':     'Company Accounts',
  'conceptual-framework':   'Conceptual Framework',
  'ratio-analysis':         'Ratio Analysis',
  'incomplete-records':     'Incomplete Records',
  'cash-flow':              'Cash Flow Statements',
  'events-after-reporting': 'Events After Reporting',
  'intangible-assets':      'Intangible Assets (IAS 38)',
  'consolidation':          'Consolidation (Group Accounts)',
  'regulatory-framework':   'Regulatory Framework',
  'cash-management':        'Cash Management',
  'related-parties':        'Related Parties & Disclosure',
};

const QUIZ_LENGTH = 10;

// ── SPACED REPETITION ────────────────────────────────────────────────
// Intervals (days): new → 1 → 7 → 30 → mastered
const SR_INTERVALS = [0, 1, 7, 30];
const SR_STORAGE_KEY = 'acca_f3_sr';

function loadSR() {
  try { return JSON.parse(localStorage.getItem(SR_STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveSR(data) {
  try { localStorage.setItem(SR_STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Update SR record for a question after answering */
function updateSR(questionId, correct) {
  const sr = loadSR();
  const rec = sr[questionId] || { interval: 0, nextReview: todayStr() };

  if (correct) {
    // Advance to next interval, cap at mastered (index 4)
    rec.interval = Math.min(rec.interval + 1, 4);
  } else {
    // Reset to first review interval
    rec.interval = 1;
  }
  const days = SR_INTERVALS[Math.min(rec.interval - 1, SR_INTERVALS.length - 1)] || 1;
  rec.nextReview = correct && rec.interval >= 4 ? '9999-12-31' : addDays(todayStr(), days);
  sr[questionId] = rec;
  saveSR(sr);
}

/** Returns questions whose review is due today (or overdue), or all new questions */
function getDueQuestions(pool) {
  const sr = loadSR();
  const today = todayStr();
  return pool.filter(q => {
    const rec = sr[q.id];
    if (!rec) return true;              // never seen = due
    if (rec.interval >= 4) return false; // mastered
    return rec.nextReview <= today;
  });
}

function getSRLabel(questionId) {
  const rec = loadSR()[questionId];
  if (!rec) return { label: 'New', cls: 'sr-new' };
  if (rec.interval >= 4) return { label: 'Mastered', cls: 'sr-mastered' };
  if (rec.interval === 3) return { label: '1 month', cls: 'sr-month' };
  if (rec.interval === 2) return { label: '1 week', cls: 'sr-week' };
  return { label: '1 day', cls: 'sr-day' };
}

function countDue() {
  const pool = QUESTIONS.filter(isRenderable);
  return getDueQuestions(pool).length;
}

// ── STATE ───────────────────────────────────────────────────────────

const state = {
  screen:        'home',
  mode:          null,      // 'mcq' | 'journal' | 'mixed' | 'review'
  topic:         null,      // topic slug, or null for all
  currentQuestion: null,
  currentIndex:  0,
  score:         0,
  answers:       [],        // { question, correct }
  usedIds:       new Set(),
  streak:        0,
  highestStreak: 0,
  generatedPool: [],
  quizLength:    10,
};

// ── SCREEN MANAGEMENT ───────────────────────────────────────────────

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  state.screen = name;
  window.scrollTo(0, 0);
}

// ── HOME SCREEN ─────────────────────────────────────────────────────

function initHome() {
  const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
  bind('btn-review',  () => startQuiz('review'));
  bind('btn-mcq',     () => startQuiz('mcq'));
  bind('btn-journal', () => startQuiz('journal'));
  bind('btn-topic',   () => { renderTopics(); showScreen('topics'); });
  bind('btn-ledger',  () => startQuiz('ledger'));
  renderHomeStats();
  renderDueBadge();
  renderWeakTopics();
}

function setQuizLength(n) {
  state.quizLength = n;
  document.querySelectorAll('.len-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('len-' + n);
  if (btn) btn.classList.add('active');
}

function renderWeakTopics() {
  const p = loadProgress();
  const attempted = Object.entries(p.topics || {})
    .filter(([, t]) => t.attempted >= 3)
    .map(([slug, t]) => ({ slug, pct: Math.round(t.correct / t.attempted * 100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  const el = document.getElementById('weak-topics-widget');
  if (!el || attempted.length === 0) return;

  el.style.display = 'block';
  el.innerHTML = `
    <p class="weak-topics-label">&#128270; Focus areas</p>
    ${attempted.map(t => `
      <button class="weak-topic-row" onclick="startTopicQuiz('${t.slug}')">
        <span class="weak-topic-name">${TOPIC_NAMES[t.slug] || t.slug}</span>
        <span class="weak-topic-pct ${t.pct >= 70 ? 'acc-good' : t.pct >= 50 ? 'acc-ok' : 'acc-low'}">${t.pct}%</span>
      </button>`).join('')}`;
}

function renderDueBadge() {
  const n = countDue();
  const badge = document.getElementById('due-count-badge');
  if (!badge) return;
  if (n > 0) {
    badge.textContent = n;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

// ── TOPIC SELECTOR ──────────────────────────────────────────────────

function renderHomeStats() {
  const acc = getOverallAccuracy();
  const p   = loadProgress();
  const el  = document.getElementById('home-stats');
  if (!el || !p.overall.attempted) return;
  el.style.display = 'block';
  el.innerHTML =
    `<span class="home-stat">${p.overall.attempted} questions answered</span>` +
    `<span class="home-stat-sep">&middot;</span>` +
    `<span class="home-stat">${acc}% overall accuracy</span>`;
}

function renderTopics() {
  const pool = QUESTIONS.filter(isRenderable);
  const sr   = loadSR();
  const topics = [...new Set(pool.map(q => q.topic))];

  // Sort: weakest topics (lowest accuracy) first, then unseen
  topics.sort((a, b) => {
    const accA = getTopicAccuracy(a);
    const accB = getTopicAccuracy(b);
    if (!accA && !accB) return 0;
    if (!accA) return 1;
    if (!accB) return -1;
    return accA.pct - accB.pct;
  });

  const grid = document.getElementById('topics-grid');
  grid.innerHTML = topics.map(topic => {
    const topicQs      = pool.filter(q => q.topic === topic);
    const mcqCount     = topicQs.filter(q => q.type === 'mcq').length;
    const journalCount = topicQs.filter(q => q.type === 'journal' || q.type === 'multi').length;
    const ledgerCount  = topicQs.filter(q => q.type === 'taccount').length;
    const parts = [];
    if (mcqCount > 0)     parts.push(mcqCount + ' MCQ');
    if (journalCount > 0) parts.push(journalCount + ' Journal');
    if (ledgerCount > 0)  parts.push(ledgerCount + ' Ledger');

    const acc = getTopicAccuracy(topic);
    const accBadge = acc
      ? `<span class="topic-acc ${acc.pct >= 70 ? 'acc-good' : acc.pct >= 50 ? 'acc-ok' : 'acc-low'}">${acc.pct}%</span>`
      : '';

    // SR: count mastered vs total for this topic
    const masteredCount = topicQs.filter(q => sr[q.id] && sr[q.id].interval >= 4).length;
    const dueCount      = getDueQuestions(topicQs).length;
    const masteredPct   = topicQs.length > 0 ? Math.round(masteredCount / topicQs.length * 100) : 0;
    const barColor      = masteredPct >= 80 ? 'var(--green)' : masteredPct >= 40 ? 'var(--amber)' : '#cbd5e1';
    const duePill       = dueCount > 0
      ? `<span class="due-badge" style="font-size:0.68rem">${dueCount} due</span>`
      : '';

    const hasNotes = typeof NOTES !== 'undefined' && !!NOTES[topic];
    const notesBtn = hasNotes
      ? `<button class="notes-btn" onclick="event.stopPropagation(); showNotes('${topic}')">&#128218; Notes</button>`
      : '';

    return `<div class="topic-card-wrap">
      <button class="topic-card" onclick="startTopicQuiz('${topic}')">
        <span class="topic-name">${TOPIC_NAMES[topic] || topic}</span>
        <span class="topic-count">${parts.join(' &middot; ')}${accBadge}${duePill}</span>
        <span class="topic-sr-bar" style="display:block"><span class="topic-sr-fill" style="display:block;width:${masteredPct}%;background:${barColor}"></span></span>
      </button>
      ${notesBtn}
    </div>`;
  }).join('');
}

// ── STUDY NOTES ──────────────────────────────────────────────────────────────

function showNotes(topic) {
  const note = (typeof NOTES !== 'undefined') && NOTES[topic];
  if (!note) { showToast('No notes available for this topic.', 'error'); return; }

  document.getElementById('notes-title').textContent = note.title;

  const introHtml = note.intro
    ? `<p class="notes-intro">${note.intro}</p>`
    : '';

  const sectionsHtml = (note.sections || []).map(sec => {
    const rulesHtml = (sec.keyRules || []).length
      ? `<ul class="notes-rules">${sec.keyRules.map(r => `<li>${r}</li>`).join('')}</ul>`
      : '';
    const bodyHtml = sec.body
      ? `<p class="notes-body">${sec.body.replace(/\n/g, '<br>')}</p>`
      : '';
    return `<div class="notes-section">
      <h3 class="notes-section-heading">${sec.heading}</h3>
      ${bodyHtml}
      ${rulesHtml}
    </div>`;
  }).join('');

  document.getElementById('notes-content').innerHTML = introHtml + sectionsHtml;

  // Back button returns to topic list
  document.getElementById('notes-back-btn').onclick = () => showScreen('topics');

  showScreen('notes');
}

function startTopicQuiz(topic) {
  state.topic = topic;
  startQuiz('mixed', topic);
}

// ── QUESTION FILTERING ──────────────────────────────────────────────

/**
 * Returns true if a question can be rendered by the current UI.
 * Excludes: build type, compound multi-credit/debit entries.
 */
function isRenderable(q) {
  if (q.type === 'build') return false;
  if (q.type === 'multi' && q.entries) {
    if (q.entries.some(e => e.credit_multi || e.debit_multi)) return false;
  }
  return true;
}

function getPool(mode, topic) {
  let pool;

  if (mode === 'ledger') {
    pool = QUESTIONS.filter(q => q.type === 'taccount');
  } else {
    pool = QUESTIONS.filter(isRenderable);
    if (mode === 'mcq') {
      pool = pool.filter(q => q.type === 'mcq');
    } else if (mode === 'journal') {
      pool = pool.filter(q => q.type === 'journal' || q.type === 'multi');
    } else if (mode === 'review') {
      pool = getDueQuestions(pool);
    }
    // 'mixed': all renderable types
  }

  if (topic) {
    pool = pool.filter(q => q.topic === topic);
  }

  return pool;
}

function pickNextQuestion() {
  const staticPool = getPool(state.mode, state.topic)
    .filter(q => !state.usedIds.has(q.id));

  const genPool = (state.mode !== 'journal')
    ? state.generatedPool.filter(q => !state.usedIds.has(q.id))
    : [];

  const pool = [...staticPool, ...genPool];
  if (pool.length === 0) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}

// ── START QUIZ ──────────────────────────────────────────────────────

function startQuiz(mode, topic = null) {
  const pool = getPool(mode, topic);
  if (pool.length === 0) {
    showToast('No questions available for this selection.', 'error');
    return;
  }

  state.mode          = mode;
  state.topic         = topic;
  state.answers       = [];
  state.usedIds       = new Set();
  state.score         = 0;
  state.streak        = 0;
  state.highestStreak = 0;
  state.currentIndex  = 0;

  state.generatedPool = (mode !== 'journal' && mode !== 'ledger')
    ? generateQuestions(12, { topic })
    : [];

  loadQuestion();
}

// ── LOAD QUESTION ───────────────────────────────────────────────────

function loadQuestion() {
  if (state.answers.length >= state.quizLength) {
    showResults();
    return;
  }

  const q = pickNextQuestion();
  if (!q) {
    // No more unused questions — end quiz early
    if (state.answers.length > 0) showResults();
    else showToast('No questions available for this selection.', 'error');
    return;
  }

  state.currentQuestion = q;
  state.usedIds.add(q.id);
  state.currentIndex = state.answers.length;

  const counter = `${state.currentIndex + 1} of ${state.quizLength}`;

  if (q.type === 'mcq') {
    renderMCQ(q, counter);
    showScreen('mcq');
  } else if (q.type === 'taccount') {
    renderTAccount(q, counter);
    showScreen('taccount');
  } else {
    renderJournal(q, counter);
    showScreen('journal');
  }
}

// ── MCQ ─────────────────────────────────────────────────────────────

function renderMCQ(q, counter) {
  document.getElementById('mcq-counter').textContent = counter;
  document.getElementById('mcq-scenario').textContent = q.scenario;
  updateStreakDisplay('mcq');
  updateProgressBar();

  const html = q.options.map((opt, i) =>
    `<button class="option-btn" onclick="handleMCQAnswer(${i})">
      <span class="option-label">${opt.label}</span>
      <span class="option-text">${opt.text}</span>
    </button>`
  ).join('');

  document.getElementById('mcq-options').innerHTML = html;
}

function handleMCQAnswer(selectedIndex) {
  const q = state.currentQuestion;
  const isCorrect = q.options[selectedIndex].correct;

  // Lock buttons and highlight
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (q.options[i].correct)                   btn.classList.add('correct');
    else if (i === selectedIndex && !isCorrect) btn.classList.add('wrong');
  });

  state.answers.push({ question: q, correct: isCorrect });
  if (isCorrect) state.score++;

  updateSR(q.id, isCorrect);
  updateStreak(isCorrect);

  setTimeout(() => showFeedback(isCorrect, q), 500);
}

// ── JOURNAL ENTRY ───────────────────────────────────────────────────

function renderJournal(q, counter) {
  document.getElementById('journal-counter').textContent = counter;
  document.getElementById('journal-scenario').textContent = q.scenario;
  document.getElementById('journal-task').textContent = q.task || '';
  updateProgressBar();

  const hintEl = document.getElementById('journal-hint');
  if (q.hint) {
    hintEl.textContent = 'Hint: ' + q.hint;
    hintEl.style.display = 'block';
  } else {
    hintEl.style.display = 'none';
  }

  updateStreakDisplay('journal');

  const sortedPool = (q.accountPool || []).slice().sort();
  const options = sortedPool.map(a => `<option value="${a}">${a}</option>`).join('');

  const html = q.entries.map((entry, i) => {
    const stepLabel = entry.description
      ? `<p class="entry-step-label">Step ${entry.step || i + 1}: ${entry.description}</p>`
      : '';
    return `<div class="entry-row card" id="entry-row-${i}">
      ${stepLabel}
      <div class="entry-fields">
        <div class="entry-line">
          <span class="entry-side dr-label">DR</span>
          <select id="entry-debit-${i}" class="account-select">
            <option value="">— select account —</option>
            ${options}
          </select>
          <span class="entry-currency">&pound;</span>
          <input type="number" id="entry-debit-amount-${i}" class="amount-input"
                 placeholder="0" min="0" step="any">
        </div>
        <div class="entry-line">
          <span class="entry-side cr-label">CR</span>
          <select id="entry-credit-${i}" class="account-select">
            <option value="">— select account —</option>
            ${options}
          </select>
          <span class="entry-currency">&pound;</span>
          <input type="number" id="entry-credit-amount-${i}" class="amount-input"
                 placeholder="0" min="0" step="any">
        </div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('journal-entries').innerHTML = html;

  // Re-enable the Check Answer button (may have been disabled by previous question)
  document.querySelector('#screen-journal .primary-btn').disabled = false;
}

function handleJournalSubmit() {
  const q = state.currentQuestion;
  let allCorrect = true;

  q.entries.forEach((entry, i) => {
    const userDebit        = document.getElementById(`entry-debit-${i}`)?.value || '';
    const userCredit       = document.getElementById(`entry-credit-${i}`)?.value || '';
    const userDebitAmount  = parseFloat(document.getElementById(`entry-debit-amount-${i}`)?.value);
    const userCreditAmount = parseFloat(document.getElementById(`entry-credit-amount-${i}`)?.value);

    const entryCorrect =
      userDebit        === entry.debit   &&
      userCredit       === entry.credit  &&
      userDebitAmount  === entry.amount  &&
      userCreditAmount === entry.amount;

    if (!entryCorrect) allCorrect = false;

    // Visual feedback per row
    const row = document.getElementById(`entry-row-${i}`);
    if (row) {
      row.classList.add(entryCorrect ? 'entry-correct' : 'entry-wrong');
    }
  });

  // Disable inputs
  document.querySelectorAll('.account-select, .amount-input').forEach(el => el.disabled = true);
  document.querySelector('#screen-journal .primary-btn').disabled = true;

  state.answers.push({ question: q, correct: allCorrect });
  if (allCorrect) state.score++;

  updateSR(q.id, allCorrect);
  updateStreak(allCorrect);

  setTimeout(() => showFeedback(allCorrect, q), 400);
}

// ── T-ACCOUNT LEDGER ─────────────────────────────────────────────────

function renderTAccount(q, counter) {
  document.getElementById('ta-counter').textContent = counter;
  document.getElementById('ta-scenario').textContent = q.scenario;
  updateStreakDisplay('ta');
  updateProgressBar();

  document.getElementById('ta-accounts').innerHTML =
    q.accounts.map((acct, ai) => buildTAccountTableHTML(acct, ai, false)).join('');

  document.getElementById('ta-submit-btn').disabled = false;
}

function buildTAccountTableHTML(acct, ai, complete) {
  const drs  = acct.debits;
  const crs  = acct.credits;
  const rows = Math.max(drs.length, crs.length);
  let tbody  = '';

  for (let ri = 0; ri < rows; ri++) {
    const dr = drs[ri];
    const cr = crs[ri];

    let drLabel, drCell;
    if (dr) {
      drLabel = `<td class="ta-label">${dr.label}</td>`;
      if (dr.given || complete) {
        const revCls = complete && !dr.given ? ' ta-reveal' : '';
        drCell = `<td class="ta-amt${revCls}">&pound;${dr.amount.toLocaleString()}</td>`;
      } else {
        drCell = `<td class="ta-input-cell"><input type="number" id="ta-${ai}-d-${ri}" class="ta-input" placeholder="0"></td>`;
      }
    } else {
      drLabel = '<td class="ta-label"></td>';
      drCell  = '<td class="ta-amt"></td>';
    }

    let crLabel, crCell;
    if (cr) {
      crLabel = `<td class="ta-cr-label">${cr.label}</td>`;
      if (cr.given || complete) {
        const revCls = complete && !cr.given ? ' ta-reveal' : '';
        crCell = `<td class="ta-amt${revCls}">&pound;${cr.amount.toLocaleString()}</td>`;
      } else {
        crCell = `<td class="ta-input-cell"><input type="number" id="ta-${ai}-c-${ri}" class="ta-input" placeholder="0"></td>`;
      }
    } else {
      crLabel = '<td class="ta-cr-label"></td>';
      crCell  = '<td class="ta-amt"></td>';
    }

    tbody += `<tr>${drLabel}${drCell}${crLabel}${crCell}</tr>`;
  }

  return `<div class="ta-table-wrap">
    <div class="ta-account-title">${acct.name}</div>
    <table class="ta-table">
      <thead><tr>
        <th colspan="2" class="ta-dr-head">DR &mdash; Debit</th>
        <th colspan="2" class="ta-cr-head">CR &mdash; Credit</th>
      </tr></thead>
      <tbody>${tbody}</tbody>
    </table>
  </div>`;
}

function buildCompleteTAccountHTML(accounts) {
  return accounts.map((acct, ai) => buildTAccountTableHTML(acct, ai, true)).join('');
}

function handleTAccountSubmit() {
  const q = state.currentQuestion;
  let allCorrect = true;

  q.accounts.forEach((acct, ai) => {
    acct.debits.forEach((dr, ri) => {
      if (!dr.given) {
        const input = document.getElementById(`ta-${ai}-d-${ri}`);
        if (input) {
          const val     = parseInt(input.value, 10);
          const correct = val === dr.amount;
          if (!correct) allCorrect = false;
          input.disabled = true;
          input.classList.add(correct ? 'ta-correct' : 'ta-wrong');
        }
      }
    });
    acct.credits.forEach((cr, ri) => {
      if (!cr.given) {
        const input = document.getElementById(`ta-${ai}-c-${ri}`);
        if (input) {
          const val     = parseInt(input.value, 10);
          const correct = val === cr.amount;
          if (!correct) allCorrect = false;
          input.disabled = true;
          input.classList.add(correct ? 'ta-correct' : 'ta-wrong');
        }
      }
    });
  });

  document.getElementById('ta-submit-btn').disabled = true;

  state.answers.push({ question: q, correct: allCorrect });
  if (allCorrect) state.score++;

  updateSR(q.id, allCorrect);
  updateStreak(allCorrect);

  setTimeout(() => showFeedback(allCorrect, q), 800);
}

// ── T-ACCOUNT HELPERS ────────────────────────────────────────────────

const CAT_LABELS = {
  asset: 'Asset', liability: 'Liability', equity: 'Equity',
  income: 'Income', expense: 'Expense', contra: 'Contra'
};

function getAccountMeta(name) {
  return ACCOUNTS.find(a => a.name === name) || null;
}

function taBadge(accountName, side) {
  const meta = getAccountMeta(accountName);
  if (!meta) return '';
  const label = CAT_LABELS[meta.cat] || meta.cat;
  const arrow = meta.normal === null ? '' : (meta.normal === side ? ' ↑' : ' ↓');
  return `<span class="ta-badge ${meta.cat}">${label}${arrow}</span>`;
}

function buildTAccountHTML(entries) {
  const rows = entries.map(e => `
    <div class="taccount">
      <div class="ta-header">
        <div class="ta-dr-header">DR &mdash; Debit</div>
        <div class="ta-cr-header">CR &mdash; Credit</div>
      </div>
      <div class="ta-body">
        <div class="ta-dr-side">
          <div class="ta-account-name">${e.debit}</div>
          ${taBadge(e.debit, 'debit')}
          <div class="ta-amount">&pound;${e.amount.toLocaleString()}</div>
        </div>
        <div class="ta-cr-side">
          <div class="ta-account-name">${e.credit}</div>
          ${taBadge(e.credit, 'credit')}
          <div class="ta-amount">&pound;${e.amount.toLocaleString()}</div>
        </div>
      </div>
    </div>`).join('');
  return `<p class="taccount-title">T-Account</p>${rows}`;
}

// ── FEEDBACK ────────────────────────────────────────────────────────

function showFeedback(isCorrect, q) {
  const banner = document.getElementById('feedback-banner');
  banner.className = 'feedback-banner ' + (isCorrect ? 'correct' : 'wrong');
  document.getElementById('feedback-icon').textContent  = isCorrect ? '✓' : '✗';
  document.getElementById('feedback-label').textContent = isCorrect ? 'Correct!' : 'Incorrect';

  const answerEl = document.getElementById('feedback-correct-answer');
  if (q.type === 'mcq') {
    const correct = q.options.find(o => o.correct);
    answerEl.innerHTML = `<strong>Correct answer:</strong> ${correct.label} &mdash; ${correct.text}`;
    if (q.entries) {
      answerEl.innerHTML += buildTAccountHTML(q.entries);
    }
  } else if (q.type === 'taccount') {
    answerEl.innerHTML = '<strong>Complete ledger:</strong>' + buildCompleteTAccountHTML(q.accounts);
  } else {
    answerEl.innerHTML = buildTAccountHTML(q.entries);
  }

  document.getElementById('feedback-explanation').textContent = q.explanation || '';

  // Show study notes button if wrong and notes exist for this topic
  const notesBtn = document.getElementById('feedback-notes-btn');
  if (notesBtn) {
    const hasNotes = !isCorrect && typeof NOTES !== 'undefined' && !!NOTES[q.topic];
    notesBtn.style.display = hasNotes ? 'block' : 'none';
    notesBtn.dataset.topic = q.topic;
  }

  showScreen('feedback');
}

function showNotesFromFeedback() {
  const topic = document.getElementById('feedback-notes-btn')?.dataset.topic;
  if (!topic) return;
  const note = (typeof NOTES !== 'undefined') && NOTES[topic];
  if (!note) return;

  document.getElementById('notes-title').textContent = note.title;
  const introHtml = note.intro ? `<p class="notes-intro">${note.intro}</p>` : '';
  const sectionsHtml = (note.sections || []).map(sec => {
    const rulesHtml = (sec.keyRules || []).length
      ? `<ul class="notes-rules">${sec.keyRules.map(r => `<li>${r}</li>`).join('')}</ul>` : '';
    const bodyHtml = sec.body ? `<p class="notes-body">${sec.body.replace(/\n/g, '<br>')}</p>` : '';
    return `<div class="notes-section"><h3 class="notes-section-heading">${sec.heading}</h3>${bodyHtml}${rulesHtml}</div>`;
  }).join('');
  document.getElementById('notes-content').innerHTML = introHtml + sectionsHtml;

  // Back returns to feedback, not topics
  document.getElementById('notes-back-btn').onclick = () => showScreen('feedback');
  showScreen('notes');
}

// ── NEXT QUESTION ────────────────────────────────────────────────────

function nextQuestion() {
  loadQuestion();
}

// ── STREAK & ADAPTIVE DIFFICULTY ────────────────────────────────────

function updateProgressBar() {
  ['mcq', 'journal', 'ta'].forEach(prefix => {
    const el = document.getElementById(`${prefix}-progress-fill`);
    if (el) el.style.width = (state.answers.length / state.quizLength * 100) + '%';
  });
}

function updateStreak(isCorrect) {
  if (isCorrect) {
    state.streak++;
    if (state.streak > state.highestStreak) state.highestStreak = state.streak;
  } else {
    state.streak = 0;
  }
}

function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function updateStreakDisplay(prefix) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`${prefix}-s${i}`);
    if (!el) continue;
    const filled = i <= state.streak;
    el.textContent = filled ? '\u25CF' : '\u25CB';  // ● or ○
    el.classList.toggle('filled', filled);
  }
}


// ── RESULTS ──────────────────────────────────────────────────────────

function showResults() {
  const total = state.answers.length;
  const pct   = total > 0 ? Math.round((state.score / total) * 100) : 0;

  saveProgress(state.answers);

  document.getElementById('results-score').textContent = `${state.score}/${total}`;
  document.getElementById('results-pct').textContent   = `${pct}%`;
  document.getElementById('results-streak').textContent = state.highestStreak;

  const overallAcc = getOverallAccuracy();
  document.getElementById('results-overall-acc').textContent = overallAcc !== null ? `${overallAcc}%` : '—';

  const wrongAnswers = state.answers.filter(a => !a.correct);
  const wrongEl = document.getElementById('results-wrong');

  if (wrongAnswers.length === 0) {
    wrongEl.innerHTML = '<p class="all-correct">Perfect score &mdash; all answers correct!</p>';
  } else {
    const items = wrongAnswers.map(a => {
      const q = a.question;
      const snippet = q.scenario.length > 110
        ? q.scenario.substring(0, 110) + '\u2026'
        : q.scenario;

      let answerLine;
      if (q.type === 'mcq') {
        const correct = q.options.find(o => o.correct);
        answerLine = `${correct.label} &mdash; ${correct.text}`;
      } else if (q.type === 'taccount') {
        answerLine = 'See ledger accounts in feedback';
      } else {
        answerLine = q.entries
          .map(e => `DR ${e.debit} / CR ${e.credit} \u2014 \u00A3${e.amount.toLocaleString()}`)
          .join('; ');
      }

      return `<div class="wrong-item">
        <p class="wrong-q">${snippet}</p>
        <p class="wrong-ans">Correct: ${answerLine}</p>
      </div>`;
    }).join('');

    wrongEl.innerHTML = '<h3>Review incorrect answers</h3>' + items;
  }

  // Results message
  const msgEl = document.getElementById('results-message');
  if (msgEl) {
    if (pct === 100)     msgEl.textContent = 'Perfect score — outstanding work!';
    else if (pct >= 70)  msgEl.textContent = 'Great result — you\'re on track to pass.';
    else if (pct >= 50)  msgEl.textContent = 'Good effort — a bit more practice and you\'ll be there.';
    else                 msgEl.textContent = 'Keep going — every attempt builds your knowledge.';
  }

  // Weak topic suggestion
  const p2 = loadProgress();
  const weakEl = document.getElementById('results-weak-suggestion');
  if (weakEl) {
    const weak = Object.entries(p2.topics || {})
      .filter(([, t]) => t.attempted >= 3)
      .map(([slug, t]) => ({ slug, pct: Math.round(t.correct / t.attempted * 100) }))
      .sort((a, b) => a.pct - b.pct)[0];
    if (weak && weak.pct < 70) {
      weakEl.style.display = 'block';
      weakEl.innerHTML = `<p class="weak-suggestion-label">&#127919; Focus next on:</p>
        <button class="weak-topic-row" onclick="showScreen('home'); renderTopics(); showScreen('topics')">
          <span class="weak-topic-name">${TOPIC_NAMES[weak.slug] || weak.slug}</span>
          <span class="weak-topic-pct acc-low">${weak.pct}%</span>
        </button>`;
    } else {
      weakEl.style.display = 'none';
    }
  }

  showScreen('results');
}

function restartQuiz() {
  startQuiz(state.mode, state.topic);
}

// ── MISC ─────────────────────────────────────────────────────────────

function confirmQuit() {
  state.streak = 0;
  showScreen('home');
}

// ── INIT ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initHome();
});
