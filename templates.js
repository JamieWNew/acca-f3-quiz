/**
 * ACCA F3 — Parameterised Question Templates
 * ============================================
 * Each template defines a question TYPE. When generate() is called it
 * randomises the numbers, builds a scenario, calculates the correct answer,
 * and constructs three plausible wrong answers based on common mistakes.
 *
 * Generated questions are plain objects in the same MCQ format as questions.js,
 * so the existing render/feedback logic works without any changes.
 */

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Random integer between min and max (inclusive) */
function _rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random value rounded to nearest `step` — keeps numbers looking realistic */
function _r(min, max, step = 1000) {
  return Math.round(_rand(min / step, max / step)) * step;
}

/** Format as £ with thousands separators */
function _gbp(n) {
  return '£' + Math.abs(n).toLocaleString();
}

/** Format a percentage to 1 decimal place */
function _pct(n) {
  return (Math.round(n * 10) / 10) + '%';
}

/** Format a ratio to 2 decimal places */
function _ratio(n) {
  return (Math.round(n * 100) / 100) + ':1';
}

/**
 * Shuffle the options and assign labels A–D.
 * correctText  — the display text of the right answer
 * wrongTexts   — array of 3 wrong answer display strings
 */
function _opts(correctText, wrongTexts) {
  // Deduplicate wrong answers against the correct answer and each other
  const seen = new Set([correctText]);
  const wrongs = [];
  for (const w of wrongTexts) {
    if (!seen.has(w) && w !== null && w !== undefined) {
      seen.add(w);
      wrongs.push(w);
    }
  }

  const all = [
    { text: correctText, correct: true },
    ...wrongs.slice(0, 3).map(w => ({ text: w, correct: false })),
  ].sort(() => Math.random() - 0.5);

  return all.map((o, i) => ({ label: ['A', 'B', 'C', 'D'][i], ...o }));
}

// ── Template definitions ──────────────────────────────────────────────────────

const TEMPLATES = [

  // ── 1. STATEMENT OF FINANCIAL POSITION — find total equity ───────────────

  {
    id: 'TPL-SOFP-EQUITY',
    topic: 'financial-statements',
    difficulty: 2,
    generate() {
      const nca        = _r(50000,  300000);
      const inventory  = _r(10000,   80000);
      const receivables= _r(5000,    40000);
      const cash       = _r(2000,    20000);
      const payables   = _r(10000,   50000);
      const loan       = _r(20000,  100000);

      const totalAssets = nca + inventory + receivables + cash;
      const totalLiab   = payables + loan;
      const equity      = totalAssets - totalLiab;
      if (equity <= 0) return null;

      return {
        type: 'mcq', difficulty: 2, topic: 'financial-statements', generated: true,
        scenario:
          `The following balances are extracted from Bramley Ltd at 31 December 20X5:\n\n` +
          `Plant & equipment: ${_gbp(nca)}\n` +
          `Inventory: ${_gbp(inventory)}\n` +
          `Trade receivables: ${_gbp(receivables)}\n` +
          `Cash at bank: ${_gbp(cash)}\n` +
          `Trade payables: ${_gbp(payables)}\n` +
          `Bank loan (non-current): ${_gbp(loan)}\n\n` +
          `What is total equity?`,
        options: _opts(
          _gbp(equity),
          [_gbp(totalAssets), _gbp(equity + payables), _gbp(equity - cash)]
        ),
        explanation:
          `Total assets = ${_gbp(nca)} + ${_gbp(inventory)} + ${_gbp(receivables)} + ${_gbp(cash)} = ${_gbp(totalAssets)}. ` +
          `Total liabilities = ${_gbp(payables)} + ${_gbp(loan)} = ${_gbp(totalLiab)}. ` +
          `Equity = Assets − Liabilities = ${_gbp(totalAssets)} − ${_gbp(totalLiab)} = ${_gbp(equity)}. ` +
          `The accounting equation always holds: Assets = Liabilities + Equity. ` +
          `The trap option ${_gbp(totalAssets)} is total assets — you must deduct ALL liabilities first. ` +
          `${_gbp(equity + payables)} is the error of forgetting current liabilities.`,
      };
    },
  },

  // ── 2. INCOME STATEMENT — gross profit ───────────────────────────────────

  {
    id: 'TPL-GP',
    topic: 'financial-statements',
    difficulty: 2,
    generate() {
      const revenue    = _r(100000, 600000);
      const openInv    = _r(10000,   60000);
      const purchases  = _r(40000,  300000);
      const closeInv   = _r(5000,    50000);

      const cogs = openInv + purchases - closeInv;
      const gp   = revenue - cogs;
      if (gp <= 0 || cogs <= 0) return null;

      return {
        type: 'mcq', difficulty: 2, topic: 'financial-statements', generated: true,
        scenario:
          `From Clifton Trading's records for the year ended 31 March 20X6:\n\n` +
          `Revenue: ${_gbp(revenue)}\n` +
          `Opening inventory: ${_gbp(openInv)}\n` +
          `Purchases: ${_gbp(purchases)}\n` +
          `Closing inventory: ${_gbp(closeInv)}\n\n` +
          `What is the gross profit?`,
        options: _opts(
          _gbp(gp),
          [
            _gbp(revenue - purchases),             // forgot opening/closing inventory adjustment
            _gbp(gp + closeInv),                   // added closing inventory instead of deducting
            _gbp(revenue - openInv - purchases),   // forgot to add back closing inventory
          ]
        ),
        explanation:
          `Cost of sales = Opening inventory + Purchases − Closing inventory = ` +
          `${_gbp(openInv)} + ${_gbp(purchases)} − ${_gbp(closeInv)} = ${_gbp(cogs)}. ` +
          `Gross profit = Revenue − Cost of sales = ${_gbp(revenue)} − ${_gbp(cogs)} = ${_gbp(gp)}. ` +
          `Opening inventory is ADDED (available to sell). Closing inventory is DEDUCTED (still an asset, not yet sold). ` +
          `Using just purchases without adjusting for inventory (${_gbp(revenue - purchases)}) is the most common error.`,
      };
    },
  },

  // ── 3. INCOME STATEMENT — profit before tax from GP + expenses ───────────

  {
    id: 'TPL-PBT',
    topic: 'financial-statements',
    difficulty: 2,
    generate() {
      const gp          = _r(50000, 200000);
      const wages       = _r(10000,  60000);
      const rent        = _r(5000,   30000);
      const admin       = _r(3000,   20000);
      const depreciation= _r(2000,   15000);

      const totalExp = wages + rent + admin + depreciation;
      const pbt      = gp - totalExp;
      if (pbt <= 0) return null;

      return {
        type: 'mcq', difficulty: 2, topic: 'financial-statements', generated: true,
        scenario:
          `Dalton Ltd's summarised income statement for the year includes:\n\n` +
          `Gross profit: ${_gbp(gp)}\n` +
          `Wages & salaries: ${_gbp(wages)}\n` +
          `Rent & rates: ${_gbp(rent)}\n` +
          `Administrative expenses: ${_gbp(admin)}\n` +
          `Depreciation: ${_gbp(depreciation)}\n\n` +
          `What is profit before tax?`,
        options: _opts(
          _gbp(pbt),
          [
            _gbp(gp - wages - rent - admin),       // forgot depreciation
            _gbp(gp - wages),                       // only deducted wages
            _gbp(gp + totalExp),                   // added expenses instead of deducting
          ]
        ),
        explanation:
          `Total operating expenses = ${_gbp(wages)} + ${_gbp(rent)} + ${_gbp(admin)} + ${_gbp(depreciation)} = ${_gbp(totalExp)}. ` +
          `Profit before tax = Gross profit − Total expenses = ${_gbp(gp)} − ${_gbp(totalExp)} = ${_gbp(pbt)}. ` +
          `ALL expenses — including non-cash ones like depreciation — must be deducted. ` +
          `A common error is omitting depreciation because no cash was paid.`,
      };
    },
  },

  // ── 4. STRAIGHT-LINE DEPRECIATION ────────────────────────────────────────

  {
    id: 'TPL-SLD',
    topic: 'nca-depreciation',
    difficulty: 1,
    generate() {
      const assetNames = ['delivery van', 'machine', 'computer equipment', 'factory equipment', 'motor vehicle'];
      const asset      = assetNames[_rand(0, assetNames.length - 1)];
      const cost       = _r(10000, 80000);
      const hasResidual= Math.random() > 0.4;
      const residual   = hasResidual ? _r(0, Math.floor(cost * 0.2), 500) : 0;
      const life       = _rand(3, 10);

      const depBase = cost - residual;
      const charge  = Math.round(depBase / life);
      if (charge <= 0) return null;

      const wrongNoResidual = Math.round(cost / life);         // forgot residual value
      const wrongDoubled    = charge * 2;                       // doubled
      const wrongLife       = Math.round(depBase / (life + 2)); // wrong useful life

      const residualNote = residual > 0 ? ` with a residual value of ${_gbp(residual)}` : ' with no residual value';

      return {
        type: 'mcq', difficulty: 1, topic: 'nca-depreciation', generated: true,
        scenario:
          `A business purchases a ${asset} for ${_gbp(cost)}${residualNote}. ` +
          `It is depreciated straight-line over ${life} years. ` +
          `What is the annual depreciation charge?`,
        options: _opts(
          _gbp(charge),
          [_gbp(wrongNoResidual), _gbp(wrongDoubled), _gbp(wrongLife)]
        ),
        explanation:
          `Straight-line depreciation = (Cost − Residual value) ÷ Useful life. ` +
          `= (${_gbp(cost)} − ${_gbp(residual)}) ÷ ${life} = ${_gbp(depBase)} ÷ ${life} = ${_gbp(charge)} per year. ` +
          `${residual > 0
            ? `The residual value MUST be deducted before dividing. Dividing the full cost gives ${_gbp(wrongNoResidual)} — a very common exam error.`
            : 'With no residual value, simply divide cost by useful life.'} ` +
          `The charge is identical every year under straight-line.`,
      };
    },
  },

  // ── 5. REDUCING BALANCE DEPRECIATION ─────────────────────────────────────

  {
    id: 'TPL-RBD',
    topic: 'nca-depreciation',
    difficulty: 2,
    generate() {
      const cost  = _r(10000, 80000);
      const rate  = _rand(20, 40); // 20% – 40%
      const yr1   = Math.round(cost * rate / 100);
      const cv1   = cost - yr1;
      const yr2   = Math.round(cv1 * rate / 100);

      const wrongSL       = Math.round(cost * rate / 100); // same as year 1 — straight-line error
      const wrongFullCost = Math.round(cost * rate / 100 * 2); // applies to cost not CV
      const wrongCumul    = yr1 + yr2;                     // cumulative instead of year 2 only

      return {
        type: 'mcq', difficulty: 2, topic: 'nca-depreciation', generated: true,
        scenario:
          `An asset costs ${_gbp(cost)} and is depreciated using the reducing balance method at ${rate}% per year. ` +
          `What is the depreciation charge for year 2?`,
        options: _opts(
          _gbp(yr2),
          [_gbp(wrongSL), _gbp(wrongCumul), _gbp(Math.round(yr2 * 1.1))]
        ),
        explanation:
          `Year 1 charge: ${rate}% × ${_gbp(cost)} = ${_gbp(yr1)}. ` +
          `Carrying amount at end of year 1: ${_gbp(cost)} − ${_gbp(yr1)} = ${_gbp(cv1)}. ` +
          `Year 2 charge: ${rate}% × ${_gbp(cv1)} = ${_gbp(yr2)}. ` +
          `Under REDUCING BALANCE, the rate is applied to the CARRYING AMOUNT (not original cost) each year. ` +
          `This means the charge falls every year. ` +
          `Applying the rate to the original cost each time (${_gbp(wrongSL)}) is the straight-line error.`,
      };
    },
  },

  // ── 6. ACCRUALS — year-end expense charge ────────────────────────────────

  {
    id: 'TPL-ACCRUAL',
    topic: 'accruals',
    difficulty: 2,
    generate() {
      const types     = ['electricity', 'gas', 'water rates', 'telephone'];
      const expName   = types[_rand(0, types.length - 1)];
      const quarterly = _r(400, 4000, 100);
      const paid      = quarterly * 3;   // 3 quarters paid
      const accrual   = quarterly;       // 1 quarter outstanding
      const yearTotal = quarterly * 4;

      return {
        type: 'mcq', difficulty: 2, topic: 'accruals', generated: true,
        scenario:
          `A business receives ${expName} bills each quarter. Each bill is ${_gbp(quarterly)}. ` +
          `During the year, three quarterly bills totalling ${_gbp(paid)} were paid. ` +
          `The fourth quarter's bill had not yet been received at the year end. ` +
          `What is the ${expName} expense charged to the income statement for the year?`,
        options: _opts(
          _gbp(yearTotal),
          [_gbp(paid), _gbp(accrual), _gbp(paid + accrual * 2)]
        ),
        explanation:
          `The ACCRUALS concept requires expenses to be matched to the period they relate to — not when cash is paid. ` +
          `The business consumed ${expName} for all four quarters, so the full year charge applies. ` +
          `Cash paid = ${_gbp(paid)} (3 quarters). ` +
          `The unpaid quarter = ${_gbp(accrual)} is an ACCRUAL: DR ${expName.charAt(0).toUpperCase() + expName.slice(1)} Expense / CR Accruals. ` +
          `Total P/L charge = ${_gbp(paid)} + ${_gbp(accrual)} = ${_gbp(yearTotal)}. ` +
          `${_gbp(paid)} (cash paid only) is the most common wrong answer — it ignores the unused quarter.`,
      };
    },
  },

  // ── 7. PREPAYMENTS — amount carried forward ───────────────────────────────

  {
    id: 'TPL-PREPAY',
    topic: 'prepayments',
    difficulty: 2,
    generate() {
      const monthNames = ['April','May','June','July','August','September','October'];
      const monthNums  = [4, 5, 6, 7, 8, 9, 10];
      const pick       = _rand(0, monthNames.length - 1);
      const mName      = monthNames[pick];
      const mNum       = monthNums[pick];

      // Annual premium divisible by 12 for clean maths
      const annual   = _r(1200, 12000, 1200);
      const monthly  = annual / 12;

      // Months in current year (payment month through December)
      const currentM = 13 - mNum;  // e.g. April=4 → 13-4=9 months
      const nextM    = mNum - 1;   // e.g. April=4 → 3 months prepaid

      const prepayment    = monthly * nextM;
      const currentExpense= monthly * currentM;

      return {
        type: 'mcq', difficulty: 2, topic: 'prepayments', generated: true,
        scenario:
          `A business pays an annual insurance premium of ${_gbp(annual)} on 1 ${mName}, ` +
          `covering the 12-month period from that date. The accounting year end is 31 December. ` +
          `What prepayment should be carried forward at 31 December?`,
        options: _opts(
          _gbp(prepayment),
          [_gbp(annual), _gbp(currentExpense), _gbp(monthly * (nextM + 1))]
        ),
        explanation:
          `The premium covers 12 months from 1 ${mName}. ` +
          `Months in the CURRENT year (1 ${mName} → 31 December) = ${currentM} months. ` +
          `Months in the NEXT year = ${nextM} months — these are paid in advance = the prepayment. ` +
          `Prepayment = ${nextM}/12 × ${_gbp(annual)} = ${_gbp(prepayment)}. ` +
          `The expense charged to this year's P/L = ${currentM}/12 × ${_gbp(annual)} = ${_gbp(currentExpense)}. ` +
          `Always ask: how many months relate to NEXT period? That is the prepayment.`,
      };
    },
  },

  // ── 8. ALLOWANCE FOR RECEIVABLES — movement ───────────────────────────────

  {
    id: 'TPL-ALLOWANCE',
    topic: 'allowance-receivables',
    difficulty: 2,
    generate() {
      const receivables = _r(50000, 300000);
      const rate        = _rand(1, 5);
      const newAllowance= Math.round(receivables * rate / 100);

      const isIncrease  = Math.random() > 0.5;
      const bfAllowance = isIncrease
        ? Math.round(newAllowance * _rand(50, 85) / 100)
        : Math.round(newAllowance * _rand(115, 160) / 100);

      const movement   = Math.abs(newAllowance - bfAllowance);
      const direction  = isIncrease ? 'charge (debit)' : 'credit';
      const dirLabel   = isIncrease ? 'Charge' : 'Credit';
      const oppDir     = isIncrease ? 'Credit' : 'Charge';

      return {
        type: 'mcq', difficulty: 2, topic: 'allowance-receivables', generated: true,
        scenario:
          `At 31 December 20X5, trade receivables total ${_gbp(receivables)}. ` +
          `The business maintains an allowance of ${rate}% of receivables. ` +
          `The allowance brought forward is ${_gbp(bfAllowance)}. ` +
          `What is the charge or credit to the income statement?`,
        options: _opts(
          `${dirLabel} of ${_gbp(movement)}`,
          [
            `${dirLabel} of ${_gbp(newAllowance)}`,   // full new balance, not movement
            `${oppDir} of ${_gbp(movement)}`,          // right amount, wrong direction
            `${dirLabel} of ${_gbp(bfAllowance)}`,    // old allowance
          ]
        ),
        explanation:
          `New allowance required = ${rate}% × ${_gbp(receivables)} = ${_gbp(newAllowance)}. ` +
          `Allowance b/f = ${_gbp(bfAllowance)}. ` +
          `Movement = ${_gbp(newAllowance)} − ${_gbp(bfAllowance)} = ${isIncrease ? '+' : '−'}${_gbp(movement)}. ` +
          `Only the MOVEMENT hits P/L — not the full new balance. ` +
          `${isIncrease
            ? `The allowance is INCREASING → DR Irrecoverable Debts Expense ${_gbp(movement)} / CR Allowance for Receivables ${_gbp(movement)}.`
            : `The allowance is DECREASING → DR Allowance for Receivables ${_gbp(movement)} / CR Irrecoverable Debts Expense ${_gbp(movement)} (reduces the expense).`}`,
      };
    },
  },

  // ── 9. ROCE ───────────────────────────────────────────────────────────────

  {
    id: 'TPL-ROCE',
    topic: 'ratio-analysis',
    difficulty: 2,
    generate() {
      const pbit       = _r(20000, 200000);
      const equity     = _r(100000, 500000);
      const ltDebt     = _r(50000,  300000);
      const capEmployed= equity + ltDebt;
      const roce       = _pct(pbit / capEmployed * 100);

      return {
        type: 'mcq', difficulty: 2, topic: 'ratio-analysis', generated: true,
        scenario:
          `The following information is available for Dalton plc:\n\n` +
          `Profit before interest and tax: ${_gbp(pbit)}\n` +
          `Shareholders' equity: ${_gbp(equity)}\n` +
          `Long-term borrowings: ${_gbp(ltDebt)}\n\n` +
          `What is the return on capital employed (ROCE)?`,
        options: _opts(
          roce,
          [
            _pct(pbit / equity * 100),           // used equity not capital employed
            _pct(pbit / ltDebt * 100),           // used debt only
            _pct(pbit / capEmployed * 50),       // halved — wrong formula
          ]
        ),
        explanation:
          `ROCE = Profit before interest and tax ÷ Capital employed × 100. ` +
          `Capital employed = Equity + Long-term debt = ${_gbp(equity)} + ${_gbp(ltDebt)} = ${_gbp(capEmployed)}. ` +
          `ROCE = ${_gbp(pbit)} ÷ ${_gbp(capEmployed)} × 100 = ${roce}. ` +
          `Key rules: use PBIT (before interest and tax, not after), and capital employed includes BOTH equity AND long-term debt. ` +
          `Using equity alone gives return on equity — a different ratio.`,
      };
    },
  },

  // ── 10. CURRENT RATIO ─────────────────────────────────────────────────────

  {
    id: 'TPL-CURRENT-RATIO',
    topic: 'ratio-analysis',
    difficulty: 1,
    generate() {
      const inventory  = _r(10000, 60000);
      const receivables= _r(10000, 80000);
      const cash       = _r(2000,  20000);
      const payables   = _r(20000, 80000);
      const overdraft  = Math.random() > 0.5 ? _r(0, 20000, 1000) : 0;

      const ca    = inventory + receivables + cash;
      const cl    = payables + overdraft;
      const curr  = _ratio(ca / cl);
      const quick = _ratio((ca - inventory) / cl);

      return {
        type: 'mcq', difficulty: 1, topic: 'ratio-analysis', generated: true,
        scenario:
          `From Ashworth Ltd's statement of financial position:\n\n` +
          `Inventory: ${_gbp(inventory)}\n` +
          `Trade receivables: ${_gbp(receivables)}\n` +
          `Cash: ${_gbp(cash)}\n` +
          `Trade payables: ${_gbp(payables)}\n` +
          (overdraft > 0 ? `Bank overdraft: ${_gbp(overdraft)}\n\n` : '\n') +
          `What is the current ratio?`,
        options: _opts(
          curr,
          [
            quick,                                         // quick ratio (no inventory) — a real ratio, not nonsense
            _ratio(ca / payables),                         // forgot overdraft in liabilities
            _ratio((receivables + cash) / cl),             // forgot inventory in assets
          ]
        ),
        explanation:
          `Current ratio = Current assets ÷ Current liabilities. ` +
          `Current assets = ${_gbp(inventory)} + ${_gbp(receivables)} + ${_gbp(cash)} = ${_gbp(ca)}. ` +
          `Current liabilities = ${_gbp(payables)}` +
          (overdraft > 0 ? ` + ${_gbp(overdraft)} (overdraft) = ${_gbp(cl)}.` : `.`) +
          ` Current ratio = ${_gbp(ca)} ÷ ${_gbp(cl)} = ${curr}. ` +
          `${quick} is the QUICK (acid-test) ratio, which excludes inventory as it may take time to sell. ` +
          `A ratio above 1:1 means current assets cover current liabilities.`,
      };
    },
  },

  // ── 11. GROSS PROFIT MARGIN ───────────────────────────────────────────────

  {
    id: 'TPL-GP-MARGIN',
    topic: 'ratio-analysis',
    difficulty: 2,
    generate() {
      const revenue = _r(100000, 600000);
      const cogs    = _r(40000, Math.floor(revenue * 0.8));
      const gp      = revenue - cogs;
      const gpPct   = _pct(gp / revenue * 100);

      return {
        type: 'mcq', difficulty: 2, topic: 'ratio-analysis', generated: true,
        scenario:
          `A business reports revenue of ${_gbp(revenue)} and cost of sales of ${_gbp(cogs)}. ` +
          `What is the gross profit margin?`,
        options: _opts(
          gpPct,
          [
            _pct(gp / cogs * 100),       // mark-up (GP as % of cost, not revenue)
            _pct(cogs / revenue * 100),  // cost ratio, not GP ratio
            _pct(gp / revenue * 50),     // halved — wrong formula
          ]
        ),
        explanation:
          `Gross profit = Revenue − Cost of sales = ${_gbp(revenue)} − ${_gbp(cogs)} = ${_gbp(gp)}. ` +
          `Gross profit margin = Gross profit ÷ Revenue × 100 = ${_gbp(gp)} ÷ ${_gbp(revenue)} × 100 = ${gpPct}. ` +
          `Margin is always expressed as a percentage OF REVENUE. ` +
          `Mark-up (${_pct(gp / cogs * 100)}) is gross profit as a percentage of COST — different denominator, different result. ` +
          `Exam questions often give one and ask you to derive the other — make sure you know which denominator to use.`,
      };
    },
  },

];

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTION MATRIX
// ═══════════════════════════════════════════════════════════════════════════════
//
// Each row is one accounting transaction type.
// Fields:
//   id          — unique slug
//   desc        — short verb phrase ("sells goods for cash")
//   narrative   — function(bizName, £amount) → scenario sentence
//   dr / cr     — account names (must match accounts.js for badge display)
//   drCat/crCat — asset | liability | equity | income | expense | contra
//   profit      — +1 (increases profit), -1 (decreases), 0 (no effect)
//   assets      — +1 / -1 / 0  (effect on TOTAL assets)
//   liabilities — +1 / -1 / 0  (effect on TOTAL liabilities)
//   topic       — question bank topic slug
//
// From this matrix THREE question styles are generated automatically:
//   1. Which journal entry records X?      (TPL-JOURNAL-MCQ)
//   2. What is the effect of X on Y?       (TPL-CONSEQUENCE)
//   3. This entry records which event?     (TPL-IDENTIFY)
// ═══════════════════════════════════════════════════════════════════════════════

const _BIZ = [
  'Harrington Ltd', 'Clifton Trading', 'Bramley & Sons', 'Oakley Supplies',
  'Dalton plc', 'Welldon Ltd', 'Ashworth Ltd', 'Parton Traders',
  'Stirling Retail', 'Meridian Co',
];

const TRANSACTIONS = [
  {
    id: 'cash-sale',
    desc: 'sells goods for cash',
    narrative: (b, a) => `${b} sells goods worth ${a} to a customer who pays immediately in cash.`,
    dr: 'Cash at Bank',         drCat: 'asset',
    cr: 'Sales Revenue',        crCat: 'income',
    profit: +1, assets: +1, liabilities: 0,
    topic: 'basic-double-entry',
  },
  {
    id: 'credit-sale',
    desc: 'makes a credit sale',
    narrative: (b, a) => `${b} sells goods worth ${a} to a customer on 30-day credit terms.`,
    dr: 'Trade Receivables',    drCat: 'asset',
    cr: 'Sales Revenue',        crCat: 'income',
    profit: +1, assets: +1, liabilities: 0,
    topic: 'basic-double-entry',
  },
  {
    id: 'cash-expense',
    desc: 'pays a cash expense (rent)',
    narrative: (b, a) => `${b} pays ${a} cash to its landlord for the month's rent.`,
    dr: 'Rent Expense',         drCat: 'expense',
    cr: 'Cash at Bank',         crCat: 'asset',
    profit: -1, assets: -1, liabilities: 0,
    topic: 'basic-double-entry',
  },
  {
    id: 'credit-purchase',
    desc: 'purchases goods on credit',
    narrative: (b, a) => `${b} purchases goods worth ${a} from a supplier on 60-day credit terms.`,
    dr: 'Purchases / Cost of Sales', drCat: 'expense',
    cr: 'Trade Payables',            crCat: 'liability',
    profit: -1, assets: 0, liabilities: +1,
    topic: 'basic-double-entry',
  },
  {
    id: 'accrued-expense',
    desc: 'accrues an outstanding expense',
    narrative: (b, a) => `At the year end, ${b} has used ${a} of electricity not yet billed by the supplier.`,
    dr: 'Electricity / Utilities', drCat: 'expense',
    cr: 'Accruals',                crCat: 'liability',
    profit: -1, assets: 0, liabilities: +1,
    topic: 'accruals',
  },
  {
    id: 'prepayment',
    desc: 'pays an expense in advance',
    narrative: (b, a) => `${b} pays ${a} for an annual insurance premium, of which half relates to the next accounting period.`,
    dr: 'Prepayments',   drCat: 'asset',
    cr: 'Cash at Bank',  crCat: 'asset',
    profit: 0, assets: 0, liabilities: 0,
    topic: 'prepayments',
  },
  {
    id: 'depreciation',
    desc: 'records annual depreciation',
    narrative: (b, a) => `${b} records its annual depreciation charge of ${a} on plant and machinery.`,
    dr: 'Depreciation Expense',                       drCat: 'expense',
    cr: 'Accumulated Depreciation — Plant & Machinery', crCat: 'contra',
    profit: -1, assets: -1, liabilities: 0,
    topic: 'nca-depreciation',
  },
  {
    id: 'write-off',
    desc: 'writes off an irrecoverable debt',
    narrative: (b, a) => `A customer of ${b} has been declared bankrupt. The outstanding debt of ${a} is written off as irrecoverable.`,
    dr: 'Irrecoverable Debts Expense', drCat: 'expense',
    cr: 'Trade Receivables',           crCat: 'asset',
    profit: -1, assets: -1, liabilities: 0,
    topic: 'irrecoverable-debts',
  },
  {
    id: 'loan-received',
    desc: 'receives a bank loan',
    narrative: (b, a) => `${b} takes out a five-year bank loan of ${a}, credited directly to its bank account.`,
    dr: 'Cash at Bank',              drCat: 'asset',
    cr: 'Bank Loan (non-current)',   crCat: 'liability',
    profit: 0, assets: +1, liabilities: +1,
    topic: 'basic-double-entry',
  },
  {
    id: 'loan-repayment',
    desc: 'repays a loan instalment',
    narrative: (b, a) => `${b} repays ${a} of its bank loan from the business current account.`,
    dr: 'Bank Loan (non-current)', drCat: 'liability',
    cr: 'Cash at Bank',            crCat: 'asset',
    profit: 0, assets: -1, liabilities: -1,
    topic: 'basic-double-entry',
  },
  {
    id: 'capital-intro',
    desc: 'owner introduces capital',
    narrative: (b, a) => `The owner of ${b} pays ${a} of personal savings into the business bank account as capital.`,
    dr: 'Cash at Bank',    drCat: 'asset',
    cr: 'Capital Account', crCat: 'equity',
    profit: 0, assets: +1, liabilities: 0,
    topic: 'basic-double-entry',
  },
  {
    id: 'drawings',
    desc: 'owner withdraws drawings',
    narrative: (b, a) => `The owner of ${b} withdraws ${a} from the business bank account for personal use.`,
    dr: 'Drawings Account', drCat: 'equity',
    cr: 'Cash at Bank',     crCat: 'asset',
    profit: 0, assets: -1, liabilities: 0,
    topic: 'basic-double-entry',
  },
  {
    id: 'pay-payable',
    desc: 'pays a trade creditor',
    narrative: (b, a) => `${b} pays ${a} to a supplier to settle an outstanding trade payable.`,
    dr: 'Trade Payables', drCat: 'liability',
    cr: 'Cash at Bank',   crCat: 'asset',
    profit: 0, assets: -1, liabilities: -1,
    topic: 'basic-double-entry',
  },
  {
    id: 'receive-receivable',
    desc: 'receives cash from a credit customer',
    narrative: (b, a) => `A credit customer pays ${b} ${a} in settlement of their outstanding invoice.`,
    dr: 'Cash at Bank',      drCat: 'asset',
    cr: 'Trade Receivables', crCat: 'asset',
    profit: 0, assets: 0, liabilities: 0,
    topic: 'basic-double-entry',
  },
  {
    id: 'nca-purchase',
    desc: 'purchases a non-current asset for cash',
    narrative: (b, a) => `${b} purchases a new machine for ${a}, paying cash immediately.`,
    dr: 'Plant & Machinery (at cost)', drCat: 'asset',
    cr: 'Cash at Bank',                crCat: 'asset',
    profit: 0, assets: 0, liabilities: 0,
    topic: 'nca-depreciation',
  },
  {
    id: 'rental-income',
    desc: 'receives rental income in cash',
    narrative: (b, a) => `${b} receives ${a} cash from a tenant as rental income for the month.`,
    dr: 'Cash at Bank',  drCat: 'asset',
    cr: 'Rental Income', crCat: 'income',
    profit: +1, assets: +1, liabilities: 0,
    topic: 'basic-double-entry',
  },
  {
    id: 'allowance-increase',
    desc: 'increases the allowance for receivables',
    narrative: (b, a) => `${b} increases its allowance for receivables by ${a} at the year end.`,
    dr: 'Irrecoverable Debts Expense', drCat: 'expense',
    cr: 'Allowance for Receivables',   crCat: 'contra',
    profit: -1, assets: -1, liabilities: 0,
    topic: 'allowance-receivables',
  },
  {
    id: 'provision',
    desc: 'creates a provision for a legal claim',
    narrative: (b, a) => `${b} recognises a provision of ${a} for a probable legal claim under IAS 37.`,
    dr: 'Legal Claims Expense', drCat: 'expense',
    cr: 'Provisions',           crCat: 'liability',
    profit: -1, assets: 0, liabilities: +1,
    topic: 'provisions',
  },
  {
    id: 'revaluation',
    desc: 'revalues a property upwards',
    narrative: (b, a) => `${b} revalues its freehold property upwards by ${a} following an independent professional valuation.`,
    dr: 'Freehold Property (at cost)', drCat: 'asset',
    cr: 'Revaluation Surplus',         crCat: 'equity',
    profit: 0, assets: +1, liabilities: 0,
    topic: 'nca-revaluation',
  },
  {
    id: 'sales-return',
    desc: 'receives a sales return from a customer',
    narrative: (b, a) => `A customer returns goods worth ${a} to ${b}, originally purchased on credit.`,
    dr: 'Sales Returns',     drCat: 'expense',
    cr: 'Trade Receivables', crCat: 'asset',
    profit: -1, assets: -1, liabilities: 0,
    topic: 'basic-double-entry',
  },
  {
    id: 'purchase-return',
    desc: 'returns goods to a supplier',
    narrative: (b, a) => `${b} returns defective goods worth ${a} to its supplier, reducing the balance owed.`,
    dr: 'Trade Payables',   drCat: 'liability',
    cr: 'Purchase Returns', crCat: 'income',
    profit: +1, assets: 0, liabilities: -1,
    topic: 'basic-double-entry',
  },
  {
    id: 'discount-allowed',
    desc: 'allows a settlement discount to a customer',
    narrative: (b, a) => `${b} allows a ${a} settlement discount to a customer who pays their invoice early.`,
    dr: 'Discount Allowed',  drCat: 'expense',
    cr: 'Trade Receivables', crCat: 'asset',
    profit: -1, assets: -1, liabilities: 0,
    topic: 'basic-double-entry',
  },
  {
    id: 'discount-received',
    desc: 'receives a settlement discount from a supplier',
    narrative: (b, a) => `${b} receives a ${a} early-payment discount from a supplier on an outstanding invoice.`,
    dr: 'Trade Payables',    drCat: 'liability',
    cr: 'Discount Received', crCat: 'income',
    profit: +1, assets: 0, liabilities: -1,
    topic: 'basic-double-entry',
  },
  {
    id: 'interest-accrued',
    desc: 'accrues interest on a bank loan',
    narrative: (b, a) => `At the year end, ${b} has incurred ${a} of interest on its bank loan that remains unpaid.`,
    dr: 'Interest Expense', drCat: 'expense',
    cr: 'Accruals',         crCat: 'liability',
    profit: -1, assets: 0, liabilities: +1,
    topic: 'accruals',
  },
  {
    id: 'share-issue',
    desc: 'issues new ordinary shares for cash',
    narrative: (b, a) => `${b} issues new ordinary shares to investors, receiving ${a} cash into the business.`,
    dr: 'Cash at Bank',           drCat: 'asset',
    cr: 'Ordinary Share Capital', crCat: 'equity',
    profit: 0, assets: +1, liabilities: 0,
    topic: 'company-accounts',
  },
  {
    id: 'dividend-declared',
    desc: 'declares a dividend to shareholders',
    narrative: (b, a) => `The directors of ${b} declare a dividend of ${a} payable to ordinary shareholders.`,
    dr: 'Retained Earnings', drCat: 'equity',
    cr: 'Dividends Payable', crCat: 'liability',
    profit: 0, assets: 0, liabilities: +1,
    topic: 'company-accounts',
  },
];

// Alternative accounts per category — used to generate plausible wrong answers
const _ALT = {
  asset:     ['Cash at Bank', 'Trade Receivables', 'Inventory', 'Prepayments',
               'Plant & Machinery (at cost)', 'Freehold Property (at cost)'],
  liability: ['Trade Payables', 'Bank Loan (non-current)', 'Accruals', 'Provisions', 'Dividends Payable'],
  income:    ['Sales Revenue', 'Rental Income', 'Discount Received', 'Purchase Returns'],
  expense:   ['Purchases / Cost of Sales', 'Wages Expense', 'Rent Expense', 'General Expenses',
               'Depreciation Expense', 'Irrecoverable Debts Expense', 'Electricity / Utilities',
               'Interest Expense', 'Sales Returns', 'Discount Allowed'],
  equity:    ['Capital Account', 'Drawings Account', 'Retained Earnings',
               'Ordinary Share Capital', 'Revaluation Surplus', 'Share Premium Account'],
  contra:    ['Accumulated Depreciation — Plant & Machinery', 'Allowance for Receivables'],
};

function _altAccount(cat, exclude) {
  const pool = (_ALT[cat] || _ALT.asset).filter(a => a !== exclude);
  return pool[_rand(0, pool.length - 1)];
}

function _effectLabel(n, item) {
  if (n > 0)  return `Increases ${item}`;
  if (n < 0)  return `Decreases ${item}`;
  return `No effect on ${item}`;
}

// ── 12. JOURNAL ENTRY MCQ — which entry records transaction X? ────────────────

TEMPLATES.push({
  id: 'TPL-JOURNAL-MCQ',
  topic: null,          // inherits from transaction
  difficulty: 2,
  generate() {
    const tx     = TRANSACTIONS[_rand(0, TRANSACTIONS.length - 1)];
    const biz    = _BIZ[_rand(0, _BIZ.length - 1)];
    const amount = _r(500, 20000, 500);
    const a      = _gbp(amount);

    // Correct: DR tx.dr / CR tx.cr
    const correct = `DR ${tx.dr} ${a}  /  CR ${tx.cr} ${a}`;

    // Wrong 1: reversed
    const rev = `DR ${tx.cr} ${a}  /  CR ${tx.dr} ${a}`;

    // Wrong 2: correct DR category but different account
    const altCr = _altAccount(tx.crCat, tx.cr);
    const wrong2 = `DR ${tx.dr} ${a}  /  CR ${altCr} ${a}`;

    // Wrong 3: correct CR category but different DR account
    const altDr = _altAccount(tx.drCat, tx.dr);
    const wrong3 = `DR ${altDr} ${a}  /  CR ${tx.cr} ${a}`;

    return {
      type: 'mcq',
      difficulty: 2,
      topic: tx.topic,
      generated: true,
      scenario: tx.narrative(biz, a) + '\n\nWhich journal entry correctly records this transaction?',
      options: _opts(correct, [rev, wrong2, wrong3]),
      explanation:
        `${tx.dr} is DEBITED — it is a ${tx.drCat} account and ${tx.drCat === 'asset' || tx.drCat === 'expense' ? 'increases on the debit side' : 'decreases on the debit side (reducing the balance)'}. ` +
        `${tx.cr} is CREDITED — it is a ${tx.crCat} account and ${tx.crCat === 'liability' || tx.crCat === 'income' || tx.crCat === 'equity' || tx.crCat === 'contra' ? 'increases on the credit side' : 'decreases on the credit side'}. ` +
        `The reversed entry (DR ${tx.cr} / CR ${tx.dr}) is the most common wrong answer — always ask: what is increasing and what is decreasing?`,
    };
  },
});

// ── 13. CONSEQUENCE MCQ — what effect does transaction X have on Y? ───────────

TEMPLATES.push({
  id: 'TPL-CONSEQUENCE',
  topic: null,
  difficulty: 2,
  generate() {
    const tx      = TRANSACTIONS[_rand(0, TRANSACTIONS.length - 1)];
    const biz     = _BIZ[_rand(0, _BIZ.length - 1)];
    const amount  = _r(500, 20000, 500);
    const a       = _gbp(amount);

    // Pick which financial statement item to ask about
    const items   = ['profit', 'total assets', 'total liabilities'];
    const item    = items[_rand(0, items.length - 1)];
    const effects = { 'profit': tx.profit, 'total assets': tx.assets, 'total liabilities': tx.liabilities };
    const effect  = effects[item];

    const correct = _effectLabel(effect, item);

    // Wrong options: the other two effects on the SAME item, making it clear
    const allEffects = [
      _effectLabel(+1, item),
      _effectLabel(-1, item),
      _effectLabel(0,  item),
    ].filter(e => e !== correct);

    // Fourth distractor: correct effect but wrong item
    const otherItem  = items.find(i => i !== item && effects[i] !== effect) || items.find(i => i !== item);
    const distractor = _effectLabel(effects[otherItem], otherItem);

    const explanations = {
      profit: {
        '+1': `This transaction records income/revenue — it increases profit.`,
        '-1': `This transaction records an expense or loss — it decreases profit.`,
        '0':  `This transaction does not involve any income or expense account — it has no effect on profit. It is a balance sheet (SOFP) transaction only.`,
      },
      'total assets': {
        '+1': `An asset account increases with no corresponding reduction in another asset — total assets rise.`,
        '-1': `An asset account decreases without a corresponding increase in another asset — total assets fall.`,
        '0':  `Either two assets move in opposite directions (asset swap — e.g. cash paid, another asset received) or no asset is involved — net effect on total assets is nil.`,
      },
      'total liabilities': {
        '+1': `A new liability is created or an existing one increases — total liabilities rise.`,
        '-1': `A liability is settled or reduced — total liabilities fall.`,
        '0':  `No liability account is affected — total liabilities are unchanged.`,
      },
    };

    const effectKey = effect > 0 ? '+1' : effect < 0 ? '-1' : '0';

    return {
      type: 'mcq',
      difficulty: 2,
      topic: tx.topic,
      generated: true,
      scenario:
        tx.narrative(biz, a) +
        `\n\nWhat is the effect of this transaction on ${item}?`,
      options: _opts(correct, [...allEffects, distractor]),
      explanation:
        `Journal entry: DR ${tx.dr} / CR ${tx.cr}. ` +
        explanations[item][effectKey] +
        ` Full effects: profit ${_effectLabel(tx.profit, '').toLowerCase()}, ` +
        `total assets ${_effectLabel(tx.assets, '').toLowerCase()}, ` +
        `total liabilities ${_effectLabel(tx.liabilities, '').toLowerCase()}.`,
    };
  },
});

// ── 14. IDENTIFY THE TRANSACTION — what does this journal entry record? ────────

TEMPLATES.push({
  id: 'TPL-IDENTIFY',
  topic: null,
  difficulty: 3,
  generate() {
    const tx     = TRANSACTIONS[_rand(0, TRANSACTIONS.length - 1)];
    const amount = _r(500, 20000, 500);
    const a      = _gbp(amount);

    // Pick 3 different distractor transactions (different id)
    const others = TRANSACTIONS.filter(t => t.id !== tx.id);
    const picks  = others.sort(() => Math.random() - 0.5).slice(0, 3);

    return {
      type: 'mcq',
      difficulty: 3,
      topic: tx.topic,
      generated: true,
      scenario:
        `A bookkeeper posts the following journal entry:\n\n` +
        `DR  ${tx.dr}   ${a}\n` +
        `CR  ${tx.cr}   ${a}\n\n` +
        `Which business transaction does this entry record?`,
      options: _opts(
        tx.desc.charAt(0).toUpperCase() + tx.desc.slice(1),
        picks.map(t => t.desc.charAt(0).toUpperCase() + t.desc.slice(1))
      ),
      explanation:
        `${tx.dr} is debited — a ${tx.drCat} account ${tx.drCat === 'asset' || tx.drCat === 'expense' ? 'increasing' : 'decreasing'}. ` +
        `${tx.cr} is credited — a ${tx.crCat} account ${tx.crCat === 'liability' || tx.crCat === 'income' || tx.crCat === 'equity' || tx.crCat === 'contra' ? 'increasing' : 'decreasing'}. ` +
        `Together this pattern always represents: ${tx.desc}. ` +
        `Effect on profit: ${_effectLabel(tx.profit, 'profit').toLowerCase()}. ` +
        `Effect on total assets: ${_effectLabel(tx.assets, 'total assets').toLowerCase()}.`,
    };
  },
});

// ── 15. NCA CARRYING AMOUNT ───────────────────────────────────────────────────

TEMPLATES.push({
  id: 'TPL-CARRYING',
  topic: 'nca-depreciation',
  difficulty: 1,
  generate() {
    const cost  = _r(10000, 100000);
    const life  = _rand(3, 10);
    const years = _rand(1, life - 1);
    const annualDep = Math.round(cost / life);
    const accumDep  = annualDep * years;
    const carrying  = cost - accumDep;

    return {
      type: 'mcq',
      difficulty: 1,
      topic: 'nca-depreciation',
      generated: true,
      scenario:
        `An asset was purchased for ${_gbp(cost)} and is depreciated straight-line over ${life} years ` +
        `with no residual value. After ${years} complete year${years > 1 ? 's' : ''}, ` +
        `what is the carrying amount (net book value)?`,
      options: _opts(
        _gbp(carrying),
        [_gbp(cost), _gbp(accumDep), _gbp(cost - annualDep)]
      ),
      explanation:
        `Annual depreciation = ${_gbp(cost)} ÷ ${life} = ${_gbp(annualDep)}. ` +
        `Accumulated depreciation after ${years} year${years > 1 ? 's' : ''} = ${_gbp(annualDep)} × ${years} = ${_gbp(accumDep)}. ` +
        `Carrying amount = Cost − Accumulated depreciation = ${_gbp(cost)} − ${_gbp(accumDep)} = ${_gbp(carrying)}. ` +
        `The carrying amount is the value shown on the statement of financial position — NOT the original cost. ` +
        `${_gbp(cost)} (original cost) is shown separately in the notes but the NET figure is ${_gbp(carrying)}.`,
    };
  },
});

// ── 16. INVENTORY — FIFO valuation ────────────────────────────────────────────

TEMPLATES.push({
  id: 'TPL-FIFO',
  topic: 'inventory',
  difficulty: 2,
  generate() {
    const p1units = _rand(10, 50);
    const p1cost  = _rand(5, 30);
    const p2units = _rand(10, 50);
    const p2cost  = p1cost + _rand(1, 8);  // second batch always more expensive (realistic)

    const totalUnits = p1units + p2units;
    const soldUnits  = _rand(Math.floor(totalUnits * 0.3), Math.floor(totalUnits * 0.8));
    const closingUnits = totalUnits - soldUnits;

    // FIFO: sell earliest units first
    let fifoClosing;
    if (soldUnits <= p1units) {
      // Sold entirely from first batch — closing comes from both batches
      const remainP1 = p1units - soldUnits;
      fifoClosing = (remainP1 * p1cost) + (p2units * p2cost);
    } else {
      // Sold all of first batch and some of second
      const soldP2 = soldUnits - p1units;
      const remainP2 = p2units - soldP2;
      fifoClosing = remainP2 * p2cost;
    }

    // AVCO closing (wrong answer — common alternative)
    const totalCost   = (p1units * p1cost) + (p2units * p2cost);
    const avgCost     = totalCost / totalUnits;
    const avcoClosing = Math.round(avgCost * closingUnits);

    // LIFO closing (wrong answer — banned under IAS 2 but students often use it)
    let lifoClosing;
    if (soldUnits <= p2units) {
      const remainP2 = p2units - soldUnits;
      lifoClosing = (p1units * p1cost) + (remainP2 * p2cost);
    } else {
      const soldP1 = soldUnits - p2units;
      const remainP1 = p1units - soldP1;
      lifoClosing = remainP1 * p1cost;
    }

    return {
      type: 'mcq',
      difficulty: 2,
      topic: 'inventory',
      generated: true,
      scenario:
        `A business has the following inventory movements:\n\n` +
        `Purchase 1: ${p1units} units @ £${p1cost} each\n` +
        `Purchase 2: ${p2units} units @ £${p2cost} each\n` +
        `Units sold: ${soldUnits}\n` +
        `Closing inventory: ${closingUnits} units\n\n` +
        `Using FIFO, what is the value of closing inventory?`,
      options: _opts(
        _gbp(fifoClosing),
        [_gbp(avcoClosing), _gbp(lifoClosing), _gbp(closingUnits * p1cost)]
      ),
      explanation:
        `FIFO (First In, First Out) assumes the EARLIEST units purchased are sold first. ` +
        `Total units available = ${p1units} + ${p2units} = ${totalUnits}. ` +
        `Units sold = ${soldUnits}, so closing inventory = ${closingUnits} units. ` +
        `Under FIFO the ${soldUnits} units sold come from the first batch first. ` +
        `Closing inventory = ${_gbp(fifoClosing)}. ` +
        `AVCO (weighted average) gives ${_gbp(avcoClosing)} — valid under IAS 2 but a different method. ` +
        `LIFO (${_gbp(lifoClosing)}) is NOT permitted under IAS 2 — a common exam trap.`,
    };
  },
});

// ── 17. SALES TAX — find net / gross / tax amount ────────────────────────────

TEMPLATES.push({
  id: 'TPL-VAT',
  topic: 'sales-tax',
  difficulty: 2,
  generate() {
    const rate     = [20, 15, 10][_rand(0, 2)];
    const netAmt   = _r(1000, 20000, 500);
    const taxAmt   = Math.round(netAmt * rate / 100);
    const grossAmt = netAmt + taxAmt;

    // Randomly ask one of three things
    const asks = ['tax amount', 'gross (VAT-inclusive) amount', 'net (VAT-exclusive) amount'];
    const ask  = asks[_rand(0, 2)];

    let scenario, correct, wrongs;

    if (ask === 'tax amount') {
      scenario = `A sale is made for a net (ex-VAT) amount of ${_gbp(netAmt)}. The VAT rate is ${rate}%. What is the VAT charged?`;
      correct  = _gbp(taxAmt);
      wrongs   = [_gbp(Math.round(grossAmt * rate / 100)), _gbp(Math.round(grossAmt / (1 + rate / 100) * rate / 100)), _gbp(netAmt)];
    } else if (ask === 'gross (VAT-inclusive) amount') {
      scenario = `A net sale of ${_gbp(netAmt)} is subject to VAT at ${rate}%. What is the gross (VAT-inclusive) amount the customer pays?`;
      correct  = _gbp(grossAmt);
      wrongs   = [_gbp(netAmt), _gbp(taxAmt), _gbp(netAmt + Math.round(netAmt * rate / 50))];
    } else {
      // Give gross, ask for net
      scenario = `A customer pays a VAT-inclusive total of ${_gbp(grossAmt)}. The VAT rate is ${rate}%. What is the net (ex-VAT) amount?`;
      correct  = _gbp(netAmt);
      wrongs   = [_gbp(grossAmt), _gbp(taxAmt), _gbp(Math.round(grossAmt - grossAmt * rate / 100))];
    }

    return {
      type: 'mcq',
      difficulty: 2,
      topic: 'sales-tax',
      generated: true,
      scenario,
      options: _opts(correct, wrongs),
      explanation:
        `Net amount: ${_gbp(netAmt)}. VAT at ${rate}%: ${_gbp(taxAmt)}. Gross amount: ${_gbp(grossAmt)}. ` +
        `Net → Gross: multiply net by (1 + ${rate}/100) = net × ${(1 + rate / 100).toFixed(2)}. ` +
        `Gross → Net: divide gross by (1 + ${rate}/100) — do NOT simply deduct ${rate}% of the gross figure. ` +
        `${rate}% of the gross (${_gbp(Math.round(grossAmt * rate / 100))}) is larger than the actual VAT (${_gbp(taxAmt)}) — a classic error.`,
    };
  },
});

// ── 18. NCA DISPOSAL — profit or loss (carrying amount given) ─────────────────

TEMPLATES.push({
  id: 'TPL-DISPOSAL',
  topic: 'nca-disposal',
  difficulty: 2,
  generate() {
    const cost     = _r(20000, 120000);
    const accDep   = _r(5000, Math.floor(cost * 0.8), 1000);
    const carrying = cost - accDep;

    const isGain   = Math.random() > 0.5;
    const swing    = _r(1000, 15000);
    const proceeds = isGain ? carrying + swing : Math.max(1000, carrying - swing);
    const result   = proceeds - carrying;
    const abs      = Math.abs(result);
    const label    = isGain ? 'Profit' : 'Loss';

    return {
      type: 'mcq', difficulty: 2, topic: 'nca-disposal', generated: true,
      scenario:
        `An asset originally costing ${_gbp(cost)} has accumulated depreciation of ${_gbp(accDep)} at the date of disposal. ` +
        `The asset is sold for ${_gbp(proceeds)}. What is the profit or loss on disposal?`,
      options: _opts(
        `${label} of ${_gbp(abs)}`,
        [
          `${isGain ? 'Loss' : 'Profit'} of ${_gbp(abs)}`,          // correct amount, wrong direction
          `${label} of ${_gbp(Math.abs(proceeds - cost))}`,          // compared proceeds to cost not CV
          `${label} of ${_gbp(Math.abs(proceeds - accDep))}`,        // compared proceeds to accum dep
        ]
      ),
      explanation:
        `Carrying amount = Cost − Accumulated depreciation = ${_gbp(cost)} − ${_gbp(accDep)} = ${_gbp(carrying)}. ` +
        `Profit/loss on disposal = Proceeds − Carrying amount = ${_gbp(proceeds)} − ${_gbp(carrying)} = ${result >= 0 ? '+' : ''}${_gbp(result)} → ${label} of ${_gbp(abs)}. ` +
        `The most common error: comparing proceeds to ORIGINAL COST (${_gbp(cost)}) — this ignores depreciation already charged to P/L in prior years. ` +
        `Always compare to CARRYING AMOUNT (net book value).`,
    };
  },
});

// ── 19. NCA DISPOSAL — chained multi-step (difficulty 3) ─────────────────────

TEMPLATES.push({
  id: 'TPL-CHAINED-DISPOSAL',
  topic: 'nca-disposal',
  difficulty: 3,
  generate() {
    const cost      = _r(20000, 120000);
    const residual  = Math.random() > 0.5 ? _r(0, Math.floor(cost * 0.15), 1000) : 0;
    const life      = _rand(4, 12);
    const yearsUsed = _rand(1, life - 1);

    const annualDep = Math.round((cost - residual) / life);
    const accDep    = annualDep * yearsUsed;
    const carrying  = cost - accDep;

    const isGain    = Math.random() > 0.4;
    const swing     = _r(500, 12000, 500);
    const proceeds  = isGain ? carrying + swing : Math.max(500, carrying - swing);
    const result    = proceeds - carrying;
    const abs       = Math.abs(result);
    const label     = result >= 0 ? 'Profit' : 'Loss';
    const residualNote = residual > 0 ? ` and a residual value of ${_gbp(residual)}` : ' with no residual value';

    return {
      type: 'mcq', difficulty: 3, topic: 'nca-disposal', generated: true,
      scenario:
        `A machine costing ${_gbp(cost)}${residualNote} is depreciated straight-line over ${life} years. ` +
        `After ${yearsUsed} complete year${yearsUsed > 1 ? 's' : ''}, the machine is sold for ${_gbp(proceeds)}. ` +
        `What is the profit or loss on disposal?`,
      options: _opts(
        `${label} of ${_gbp(abs)}`,
        [
          `${result >= 0 ? 'Loss' : 'Profit'} of ${_gbp(abs)}`,
          `${label} of ${_gbp(Math.abs(proceeds - cost))}`,
          `${label} of ${_gbp(Math.abs(proceeds - annualDep))}`,
        ]
      ),
      explanation:
        `Step 1 — Annual depreciation = (${_gbp(cost)} − ${_gbp(residual)}) ÷ ${life} = ${_gbp(annualDep)}. ` +
        `Step 2 — Accumulated depreciation after ${yearsUsed} year${yearsUsed > 1 ? 's' : ''} = ${_gbp(annualDep)} × ${yearsUsed} = ${_gbp(accDep)}. ` +
        `Step 3 — Carrying amount = ${_gbp(cost)} − ${_gbp(accDep)} = ${_gbp(carrying)}. ` +
        `Step 4 — Profit/loss = Proceeds − Carrying amount = ${_gbp(proceeds)} − ${_gbp(carrying)} = ${_gbp(result)} → ${label} of ${_gbp(abs)}.`,
    };
  },
});

// ── 20. RECEIVABLES DAYS ──────────────────────────────────────────────────────

TEMPLATES.push({
  id: 'TPL-RECV-DAYS',
  topic: 'ratio-analysis',
  difficulty: 2,
  generate() {
    const recv    = _r(20000, 150000);
    const revenue = _r(150000, 800000);
    const days    = Math.round(recv / revenue * 365);

    return {
      type: 'mcq', difficulty: 2, topic: 'ratio-analysis', generated: true,
      scenario:
        `A business reports annual revenue of ${_gbp(revenue)} and year-end trade receivables of ${_gbp(recv)}. ` +
        `What are the receivables days?`,
      options: _opts(
        `${days} days`,
        [
          `${Math.round(recv / revenue * 100)} days`,        // used 100 not 365
          `${Math.round(revenue / recv * 365)} days`,        // fraction inverted
          `${Math.round(recv / (revenue * 0.65) * 365)} days`, // used approx COGS not revenue
        ]
      ),
      explanation:
        `Receivables days = (Trade receivables ÷ Revenue) × 365 = (${_gbp(recv)} ÷ ${_gbp(revenue)}) × 365 = ${days} days. ` +
        `This measures how long, on average, it takes to collect cash from credit customers. Lower = faster collection. ` +
        `Unlike payables and inventory days, receivables days uses REVENUE as the denominator (not cost of sales), ` +
        `because receivables arise from sales at selling price. ` +
        `Inverting the fraction is the most common calculation error.`,
    };
  },
});

// ── 21. PAYABLES DAYS ─────────────────────────────────────────────────────────

TEMPLATES.push({
  id: 'TPL-PAY-DAYS',
  topic: 'ratio-analysis',
  difficulty: 2,
  generate() {
    const pay  = _r(15000, 100000);
    const cogs = _r(80000, 500000);
    const days = Math.round(pay / cogs * 365);

    return {
      type: 'mcq', difficulty: 2, topic: 'ratio-analysis', generated: true,
      scenario:
        `A business reports cost of sales of ${_gbp(cogs)} and year-end trade payables of ${_gbp(pay)}. ` +
        `What are the payables days?`,
      options: _opts(
        `${days} days`,
        [
          `${Math.round(pay / cogs * 100)} days`,
          `${Math.round(cogs / pay * 365)} days`,
          `${Math.round(pay / (cogs * 1.35) * 365)} days`,
        ]
      ),
      explanation:
        `Payables days = (Trade payables ÷ Cost of sales) × 365 = (${_gbp(pay)} ÷ ${_gbp(cogs)}) × 365 = ${days} days. ` +
        `This measures how long the business takes to pay its suppliers. Higher = longer free credit from suppliers. ` +
        `Payables days uses COST OF SALES as the denominator (not revenue) because payables relate to purchases which are recorded at cost. ` +
        `This is the key distinction from receivables days, which uses revenue.`,
    };
  },
});

// ── 22. INVENTORY DAYS ────────────────────────────────────────────────────────

TEMPLATES.push({
  id: 'TPL-INV-DAYS',
  topic: 'ratio-analysis',
  difficulty: 2,
  generate() {
    const inv  = _r(10000, 80000);
    const cogs = _r(80000, 500000);
    const days = Math.round(inv / cogs * 365);

    return {
      type: 'mcq', difficulty: 2, topic: 'ratio-analysis', generated: true,
      scenario:
        `A business reports cost of sales of ${_gbp(cogs)} and closing inventory of ${_gbp(inv)}. ` +
        `What are the inventory days (inventory holding period)?`,
      options: _opts(
        `${days} days`,
        [
          `${Math.round(inv / cogs * 100)} days`,
          `${Math.round(cogs / inv * 365)} days`,
          `${Math.round(inv / (cogs * 1.3) * 365)} days`,
        ]
      ),
      explanation:
        `Inventory days = (Inventory ÷ Cost of sales) × 365 = (${_gbp(inv)} ÷ ${_gbp(cogs)}) × 365 = ${days} days. ` +
        `This measures how many days, on average, inventory is held before being sold. Lower = faster turnover. ` +
        `The denominator is COST OF SALES (inventory is valued at cost, so the comparison must also be at cost). ` +
        `Cash operating cycle = Inventory days + Receivables days − Payables days.`,
    };
  },
});

// ── 23. INVENTORY — AVCO ─────────────────────────────────────────────────────

TEMPLATES.push({
  id: 'TPL-AVCO',
  topic: 'inventory',
  difficulty: 2,
  generate() {
    const p1u = _rand(10, 60);
    const p1c = _rand(5, 25);
    const p2u = _rand(10, 60);
    const p2c = p1c + _rand(1, 10);

    const totalU    = p1u + p2u;
    const totalCost = p1u * p1c + p2u * p2c;
    const avco      = totalCost / totalU;
    const soldU     = _rand(Math.floor(totalU * 0.3), Math.floor(totalU * 0.75));
    const closeU    = totalU - soldU;
    const avcoVal   = Math.round(avco * closeU);

    // FIFO closing (plausible wrong answer)
    let fifoVal;
    if (soldU <= p1u) {
      fifoVal = (p1u - soldU) * p1c + p2u * p2c;
    } else {
      fifoVal = Math.max(0, p2u - (soldU - p1u)) * p2c;
    }

    return {
      type: 'mcq', difficulty: 2, topic: 'inventory', generated: true,
      scenario:
        `A business has the following inventory movements:\n\n` +
        `Batch 1: ${p1u} units @ £${p1c} each\n` +
        `Batch 2: ${p2u} units @ £${p2c} each\n` +
        `Units sold: ${soldU}\n` +
        `Closing inventory: ${closeU} units\n\n` +
        `Using AVCO (weighted average cost), what is the value of closing inventory?`,
      options: _opts(
        _gbp(avcoVal),
        [_gbp(fifoVal), _gbp(closeU * p1c), _gbp(closeU * p2c)]
      ),
      explanation:
        `AVCO = Total cost ÷ Total units = [(${p1u} × £${p1c}) + (${p2u} × £${p2c})] ÷ ${totalU} ` +
        `= ${_gbp(totalCost)} ÷ ${totalU} = £${(Math.round(avco * 100) / 100).toFixed(2)} per unit. ` +
        `Closing inventory = ${closeU} units × £${(Math.round(avco * 100) / 100).toFixed(2)} = ${_gbp(avcoVal)}. ` +
        `Under AVCO, the same blended cost per unit applies to all units — sold and remaining. ` +
        `${_gbp(fifoVal)} is the FIFO answer (valid under IAS 2 but a different method). ` +
        `${_gbp(closeU * p2c)} is the LIFO answer — NOT permitted under IAS 2.`,
    };
  },
});

// ── 24. MARK-UP ↔ MARGIN CONVERSION ──────────────────────────────────────────

TEMPLATES.push({
  id: 'TPL-MARKUP',
  topic: 'incomplete-records',
  difficulty: 2,
  generate() {
    // Clean integer pairs [markup%, margin%] — cost=100, GP=markup, revenue=100+markup
    const pairs   = [[25,20],[50,33],[100,50],[20,17],[33,25],[60,38],[40,29]];
    const [mu, mg]= pairs[_rand(0, pairs.length - 1)];
    const toMargin= Math.random() > 0.5;

    const cost    = _r(10000, 80000);
    const gp      = Math.round(cost * mu / 100);
    const revenue = cost + gp;

    if (toMargin) {
      return {
        type: 'mcq', difficulty: 2, topic: 'incomplete-records', generated: true,
        scenario:
          `A business applies a mark-up of ${mu}% on cost. Cost of goods sold is ${_gbp(cost)}. ` +
          `What is the gross profit MARGIN (as a % of revenue)?`,
        options: _opts(
          `${mg}%`,
          [`${mu}%`, `${Math.round(100 - mg)}%`, `${Math.round(mg / 2)}%`]
        ),
        explanation:
          `Mark-up ${mu}% on cost: GP = ${mu}% × ${_gbp(cost)} = ${_gbp(gp)}. Revenue = ${_gbp(cost)} + ${_gbp(gp)} = ${_gbp(revenue)}. ` +
          `Gross profit MARGIN = GP ÷ Revenue × 100 = ${_gbp(gp)} ÷ ${_gbp(revenue)} × 100 = ${mg}%. ` +
          `MARK-UP: GP ÷ Cost. MARGIN: GP ÷ Revenue. Same GP — different denominator — different %. ` +
          `Using the mark-up% (${mu}%) as the margin is the classic exam error.`,
      };
    } else {
      return {
        type: 'mcq', difficulty: 2, topic: 'incomplete-records', generated: true,
        scenario:
          `A business earns revenue of ${_gbp(revenue)} and has a gross profit margin of ${mg}% on revenue. ` +
          `What is the mark-up percentage on cost?`,
        options: _opts(
          `${mu}%`,
          [`${mg}%`, `${Math.round(mu / 2)}%`, `${mu + 10}%`]
        ),
        explanation:
          `Margin ${mg}% on revenue: GP = ${mg}% × ${_gbp(revenue)} ≈ ${_gbp(gp)}. Cost = ${_gbp(revenue)} − ${_gbp(gp)} = ${_gbp(cost)}. ` +
          `Mark-up = GP ÷ Cost × 100 = ${_gbp(gp)} ÷ ${_gbp(cost)} × 100 = ${mu}%. ` +
          `MARGIN uses Revenue as denominator. MARK-UP uses Cost. ` +
          `Quick formula: mark-up = margin ÷ (100 − margin) × 100.`,
      };
    }
  },
});

/**
 * Generate an array of question objects from the template pool.
 *
 * @param {number} count        How many questions to generate
 * @param {object} opts
 * @param {string} opts.topic     Filter to a specific topic slug (optional)
 * @param {number} opts.difficulty Filter to a difficulty level (optional)
 */
function generateQuestions(count = 5, { topic = null, difficulty = null } = {}) {
  let pool = TEMPLATES.filter(t => {
    if (topic && t.topic !== topic) return false;
    if (difficulty && t.difficulty !== difficulty) return false;
    return true;
  });

  // Fallback: if topic/difficulty filter yields nothing, use all templates
  if (pool.length === 0) pool = [...TEMPLATES];

  const results = [];

  // First pass: shuffle then iterate — each template used AT MOST ONCE
  // This prevents the same template appearing twice in one quiz session.
  const pass1 = [...pool].sort(() => Math.random() - 0.5);
  for (const tpl of pass1) {
    if (results.length >= count) break;
    const q = tpl.generate();
    if (q) {
      q.id = `GEN-${tpl.id}-${Date.now()}-${results.length}`;
      results.push(q);
    }
  }

  // Second pass: only reached if count exceeds the number of available templates
  if (results.length < count) {
    const pass2 = [...pool].sort(() => Math.random() - 0.5);
    for (const tpl of pass2) {
      if (results.length >= count) break;
      const q = tpl.generate();
      if (q) {
        q.id = `GEN-${tpl.id}-${Date.now()}-${results.length}-b`;
        results.push(q);
      }
    }
  }

  return results;
}
