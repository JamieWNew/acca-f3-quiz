/**
 * ACCA F3 — Topic Study Notes
 * ============================
 * Key passages and rules extracted from the BPP F3 Study Text.
 * Shown in the study notes screen when a user taps "Notes" on a topic card.
 *
 * Each entry: { title, intro, sections: [{ heading, body, keyRules? }] }
 * keyRules is an optional array of short bullet-point rules.
 */

const NOTES = {

  'sales-tax': {
    title: 'Sales Tax',
    intro: 'Sales tax (VAT) is an indirect tax levied on the sale of goods and services. Registered businesses collect it on behalf of the government.',
    sections: [
      {
        heading: 'Output and Input Tax',
        body: 'Output sales tax is charged on goods and services SOLD by the business — collected from customers. Input sales tax is suffered on goods and services BOUGHT by the business — paid to suppliers.\n\nIf output tax exceeds input tax: pay the difference to the tax authority. If input exceeds output: claim a refund.',
        keyRules: [
          'Output tax → CREDIT Sales Tax Control Account',
          'Input tax (recoverable) → DEBIT Sales Tax Control Account',
          'Balance owed to authority → current liability in SOFP',
        ],
      },
      {
        heading: 'Accounting Entries — Credit Sale',
        body: 'Sale of goods for £500 net + £100 sales tax (20%) on credit:\n\nDR Trade Receivables   £600\nCR Sales Revenue        £500\nCR Sales Tax Control    £100\n\nSales revenue is ALWAYS recorded net of tax. The full £600 is owed by the customer.',
      },
      {
        heading: 'Accounting Entries — Credit Purchase',
        body: 'Purchase of goods for £400 net + £80 sales tax (20%) on credit (fully recoverable):\n\nDR Purchases                    £400\nDR Sales Tax Control Account     £80\nCR Trade Payables               £480\n\nPurchases are recorded net. Recoverable input tax goes to the control account, not to cost.',
      },
      {
        heading: 'Irrecoverable Sales Tax',
        body: 'Where a business is NOT registered (or the tax is specifically irrecoverable), the sales tax CANNOT be reclaimed. It must be added to the cost of the purchase.\n\nExample: a non-registered business buys equipment for £8,000 + £1,600 sales tax. The asset is capitalised at £9,600. Higher asset cost = higher depreciation charge.',
        keyRules: [
          'Irrecoverable tax → part of asset cost (capitalise) or revenue expense',
          'Recoverable tax → goes to Sales Tax Control Account, not the cost account',
        ],
      },
      {
        heading: 'Extracting Net Amount from a Gross Figure',
        body: 'When a gross (tax-inclusive) amount is given:\n\nNet = Gross ÷ (1 + tax rate)\nTax = Gross − Net   OR   Net × tax rate\n\nExample: gross receipt £1,150 including 15% tax:\nNet = £1,150 ÷ 1.15 = £1,000\nTax = £1,150 − £1,000 = £150\n\nDo NOT multiply the gross figure directly by the tax rate.',
      },
    ],
  },

  'bank-reconciliation': {
    title: 'Bank Reconciliation',
    intro: 'A bank reconciliation explains why the cash book balance differs from the bank statement balance. It is a key internal control.',
    sections: [
      {
        heading: 'Three Causes of Differences',
        body: 'The cash book and bank statement will rarely agree exactly. Differences arise from three sources:',
        keyRules: [
          'ERRORS — usually in the cash book (e.g. transposition, wrong amount)',
          'OMISSIONS — items on the bank statement not yet in the cash book (bank charges, direct debits, standing orders, interest)',
          'TIMING DIFFERENCES — items in one record but not yet processed by the other',
        ],
      },
      {
        heading: 'Timing Differences',
        body: 'Two types:\n\n1. UNPRESENTED CHEQUES — the business has written and recorded the cheque as a payment in the cash book, but the bank has not yet processed it. The bank statement shows a higher balance.\n\n2. OUTSTANDING LODGEMENTS (deposits in transit) — the business has banked money and recorded it as a receipt in the cash book, but the bank has not yet credited it. The bank statement shows a lower balance.',
      },
      {
        heading: 'The Reconciliation Process',
        body: 'Step 1 — Correct the cash book for any OMISSIONS (items on the statement not in the cash book). Examples: bank charges, direct debits, interest received.\n\nStep 2 — Prepare the bank reconciliation statement using TIMING DIFFERENCES only:\n\nBalance per bank statement\n+ Outstanding lodgements\n− Unpresented cheques\n= Corrected cash book balance\n\nThe figure in the financial statements is the CORRECTED CASH BOOK balance, not the bank statement figure.',
        keyRules: [
          'Cash book omissions → update the cash book first',
          'Timing differences → go in the reconciliation statement only',
          'SOFP shows the corrected cash book balance',
        ],
      },
      {
        heading: 'The Mirror Image Rule',
        body: 'The bank statement is the MIRROR IMAGE of the cash book:\n\n• Money in your account = a credit on the bank statement (the bank owes YOU)\n• A debit on the bank statement = a payment OUT of your account\n\nSo a business with £8,000 in the bank has a DEBIT balance in its cash book but the bank statement shows a CREDIT of £8,000.',
      },
    ],
  },

  'cash-flow': {
    title: 'Statements of Cash Flows (IAS 7)',
    intro: 'Profit and cash are not the same thing. The statement of cash flows shows where cash came from and where it went during the period.',
    sections: [
      {
        heading: 'Three Sections',
        body: 'IAS 7 requires cash flows to be classified into three sections:\n\n1. OPERATING — day-to-day trading: cash from customers, payments to suppliers, wages, tax paid.\n\n2. INVESTING — buying/selling long-term assets: purchase or sale of non-current assets, loans made to other entities.\n\n3. FINANCING — changing capital structure: issuing shares, raising loans, repaying loans, paying dividends.',
        keyRules: [
          'Depreciation is NOT a cash flow — add it back when calculating operating cash flow',
          'Purchase of NCA → Investing outflow',
          'Proceeds from share issue → Financing inflow',
          'Dividends paid → Financing outflow (usually)',
        ],
      },
      {
        heading: 'Indirect Method — Operating Activities',
        body: 'The indirect method is most common. Start with PROFIT BEFORE TAX and adjust:\n\n+ Depreciation (add back — non-cash charge)\n+ Amortisation (add back — non-cash charge)\n+ Loss on disposal (add back — non-cash, no cash here)\n− Profit on disposal (deduct — proceeds appear in investing)\n± Changes in working capital:\n  − Increase in inventory (uses cash)\n  + Decrease in inventory (releases cash)\n  − Increase in receivables (uses cash)\n  + Decrease in receivables (releases cash)\n  + Increase in payables (saves cash)\n  − Decrease in payables (uses cash)',
      },
      {
        heading: 'Working Capital Rule',
        body: 'A simple rule to remember the direction of working capital adjustments:\n\nASSET UP → Cash OUT (deduct)\nASSET DOWN → Cash IN (add)\nLIABILITY UP → Cash SAVED (add)\nLIABILITY DOWN → Cash USED (deduct)',
      },
      {
        heading: 'Cash vs Profit — Why They Differ',
        body: 'In the long run, profit and cash should converge. In the short run they diverge because:\n\n• Non-cash expenses (depreciation, amortisation, provisions)\n• Credit transactions (revenue recognised before cash received)\n• Capital expenditure (cash out but capitalised, not expensed)\n• Inventory changes (cash paid for stock not yet sold)',
      },
    ],
  },

  'events-after-reporting': {
    title: 'Events After the Reporting Period (IAS 10)',
    intro: 'Events occurring between the reporting date and the date the financial statements are approved can require adjustment to, or disclosure in, the financial statements.',
    sections: [
      {
        heading: 'Two Types of Events',
        body: 'IAS 10 distinguishes:\n\nADJUSTING EVENTS — provide evidence of conditions that EXISTED AT the reporting date. The financial statements must be adjusted.\n\nNON-ADJUSTING EVENTS — relate to conditions that AROSE AFTER the reporting date. No adjustment to figures, but disclose in notes if material.',
        keyRules: [
          'Condition existed at year end → ADJUSTING (update figures)',
          'New condition arose after year end → NON-ADJUSTING (disclose in notes)',
          'Disclosure: nature of event + estimated financial effect',
        ],
      },
      {
        heading: 'Examples of Adjusting Events',
        body: '• Customer who owed money at year end goes bankrupt after year end (confirms receivable was uncollectable at year end)\n• Court settlement confirming a year-end liability\n• Discovery that inventory was damaged or obsolete at year end\n• Finalisation of a purchase price that was estimated at year end',
      },
      {
        heading: 'Examples of Non-Adjusting Events',
        body: '• Fire or flood AFTER year end destroying an asset in good condition at year end\n• Major new contract signed after year end\n• A rights issue or share buyback after year end\n• A major acquisition after year end\n• Proposed dividend declared after year end',
      },
      {
        heading: 'Dividends — Special Rule',
        body: 'Dividends proposed or declared AFTER the reporting date are NON-ADJUSTING under IAS 10. They must NOT be recognised as a liability at the reporting date. They should be disclosed in the notes.\n\nReason: at the reporting date, no obligation to pay existed yet. The obligation only arises on declaration.',
      },
    ],
  },

  'nca-disposal': {
    title: 'Non-Current Asset Disposals',
    intro: 'When a non-current asset is sold, there is likely to be a profit or loss on disposal — the difference between net proceeds and carrying amount.',
    sections: [
      {
        heading: 'Calculating Profit or Loss on Disposal',
        body: 'Profit/Loss on disposal = Net proceeds − Carrying amount at disposal\n\nCarrying amount = Cost − Accumulated depreciation at the date of disposal\n\nIf proceeds > carrying amount → PROFIT on disposal (credit in P&L)\nIf proceeds < carrying amount → LOSS on disposal (debit in P&L)',
        keyRules: [
          'Always compare proceeds to CARRYING AMOUNT, not original cost',
          'Part-year depreciation may need to be calculated for the year of disposal',
          'Profit/loss appears in P&L, usually below gross profit',
        ],
      },
      {
        heading: 'Ledger Entries — The Disposal Account',
        body: 'A disposal account is opened as a clearing account:\n\n1. Transfer asset at COST:\n   DR Disposal Account / CR Asset (at cost)\n\n2. Transfer accumulated depreciation:\n   DR Accumulated Depreciation / CR Disposal Account\n\n3. Record proceeds:\n   DR Cash (or Trade Receivables) / CR Disposal Account\n\n4. Balance = profit or loss:\n   If CR balance → profit: DR Disposal Account / CR Profit on Disposal\n   If DR balance → loss: DR Loss on Disposal / CR Disposal Account',
      },
      {
        heading: 'Part-Exchange',
        body: 'When an old asset is part-exchanged for a new one:\n\n• The TRADE-IN ALLOWANCE = disposal proceeds for the old asset\n• Profit/loss = Trade-in allowance − Carrying amount of old asset\n• Cost of NEW asset = Trade-in allowance + Cash additionally paid\n\nExample: old asset CA £6,000, trade-in £7,500, extra cash £22,500.\nProfit = £7,500 − £6,000 = £1,500\nNew asset cost = £7,500 + £22,500 = £30,000',
      },
    ],
  },

  'nca-revaluation': {
    title: 'Revaluation of Non-Current Assets (IAS 16)',
    intro: 'IAS 16 allows entities to revalue non-current assets to fair value. Once adopted for a class of assets, revaluation must be kept up to date.',
    sections: [
      {
        heading: 'The Revaluation Model',
        body: 'Under IAS 16, entities may choose between:\n\n• COST MODEL: asset carried at cost less accumulated depreciation and impairment\n• REVALUATION MODEL: asset carried at fair value at date of revaluation, less subsequent depreciation\n\nIf the revaluation model is chosen, the WHOLE CLASS of assets must be revalued (not just selected assets), and revaluations must be kept sufficiently up to date.',
      },
      {
        heading: 'Upward Revaluation — Entries',
        body: 'When an asset is revalued upward:\n\nStep 1 — Eliminate accumulated depreciation:\n  DR Accumulated Depreciation / CR Asset (at cost)\n  (nets the asset to its carrying amount)\n\nStep 2 — Restate to new fair value:\n  DR Asset (at valuation) / CR Revaluation Surplus\n  (the increase goes to equity via OCI — NOT profit)\n\nThe revaluation surplus is a capital reserve in equity. It is NOT distributable as a dividend.',
        keyRules: [
          'Upward revaluation → credit Revaluation Surplus (equity, not P&L)',
          'Downward revaluation → first absorb any existing surplus, then charge to P&L',
          'Revaluation surplus cannot be paid as a dividend',
        ],
      },
      {
        heading: 'Effect on Depreciation',
        body: 'After revaluation, depreciation is charged on the NEW carrying amount over the REMAINING useful life.\n\nExample: building CA £50,000 revalued to £80,000. Remaining life 10 years.\nNew annual depreciation = £80,000 ÷ 10 = £8,000 (was £5,000)\n\nThe extra £3,000 is "excess depreciation" — IAS 16 permits an annual transfer of this amount from Revaluation Surplus to Retained Earnings (an equity movement only, not P&L).',
      },
      {
        heading: 'Downward Revaluation',
        body: 'A downward revaluation is first absorbed by any existing Revaluation Surplus for that asset:\n  DR Revaluation Surplus / CR Asset\n\nIf the fall exceeds the existing surplus, the excess is charged to P&L:\n  DR Impairment Loss (P&L) / CR Asset\n\nLand is NOT depreciated but can be revalued upward or downward.',
      },
    ],
  },

  'provisions': {
    title: 'Provisions and Contingencies (IAS 37)',
    intro: 'A provision is a liability of uncertain timing or amount. IAS 37 sets strict rules on when provisions can be recognised to prevent manipulation of profits.',
    sections: [
      {
        heading: 'Three Recognition Criteria',
        body: 'A provision must ONLY be recognised when ALL three conditions are met:\n\n1. PRESENT OBLIGATION — a legal or constructive obligation exists as a result of a PAST EVENT\n2. PROBABLE OUTFLOW — it is more likely than not (>50%) that economic benefits will flow out\n3. RELIABLE ESTIMATE — the amount can be estimated with sufficient reliability\n\nIf all three are met: recognise a provision. If not: do not provide.',
        keyRules: [
          'All three criteria must be met simultaneously',
          'A future intention alone does not create an obligation',
          'Constructive obligation: entity has created a valid expectation through past practice',
        ],
      },
      {
        heading: 'Provision Journal Entries',
        body: 'Creating a provision:\n  DR Provision Expense (P&L)    £X\n  CR Provision (SOFP)           £X\n\nUsing/settling a provision:\n  DR Provision (SOFP)    £X paid\n  CR Cash at Bank         £X paid\n\nIncreasing a provision:\n  DR Provision Expense    £extra\n  CR Provision             £extra\n\nReleasing (reducing) a provision:\n  DR Provision            £reduction\n  CR Provision Expense (as income)  £reduction',
      },
      {
        heading: 'Contingent Liabilities',
        body: 'A CONTINGENT LIABILITY is a possible obligation that depends on an uncertain future event, or a present obligation where outflow is NOT probable or cannot be reliably measured.\n\n• POSSIBLE but not probable → DISCLOSE in notes (not recognised)\n• REMOTE → no action required\n\nA contingent liability must NEVER be recognised as a liability in the financial statements.',
        keyRules: [
          'Probable (>50%) → recognise a provision',
          'Possible (not probable) → disclose as contingent liability in notes',
          'Remote → no disclosure required',
        ],
      },
      {
        heading: 'Contingent Assets',
        body: 'A CONTINGENT ASSET is a possible asset that depends on an uncertain future event.\n\n• VIRTUALLY CERTAIN → recognise as an actual asset\n• PROBABLE → disclose in notes only\n• Possible/remote → no disclosure\n\nThis asymmetry (assets need higher certainty than liabilities) reflects the PRUDENCE concept.',
      },
    ],
  },

  'conceptual-framework': {
    title: 'The Conceptual Framework',
    intro: 'The IASB Conceptual Framework provides the foundations for developing accounting standards. It defines the purpose, elements, and qualitative characteristics of financial statements.',
    sections: [
      {
        heading: 'The Five Elements',
        body: 'Financial statements report on five elements:\n\n1. ASSETS — present economic resources controlled by the entity as a result of past events\n2. LIABILITIES — present obligations to transfer economic resources as a result of past events\n3. EQUITY — the residual interest (Assets − Liabilities)\n4. INCOME — increases in assets or decreases in liabilities that increase equity (includes revenue and gains)\n5. EXPENSES — decreases in assets or increases in liabilities that decrease equity (includes losses)',
      },
      {
        heading: 'Qualitative Characteristics',
        body: 'TWO FUNDAMENTAL characteristics (must be present for information to be useful):\n  • RELEVANCE — capability to make a difference to a user\'s decision (predictive or confirmatory value)\n  • FAITHFUL REPRESENTATION — complete, neutral, free from material error\n\nFOUR ENHANCING characteristics (improve usefulness):\n  • Comparability (including consistency)\n  • Verifiability\n  • Timeliness\n  • Understandability',
        keyRules: [
          'Relevance + Faithful Representation = FUNDAMENTAL',
          'Comparability, Verifiability, Timeliness, Understandability = ENHANCING',
          'Materiality is an aspect of relevance',
        ],
      },
      {
        heading: 'Recognition',
        body: 'An item is RECOGNISED in the financial statements when:\n  1. It meets the definition of an element, AND\n  2. It is probable that economic benefits will flow, AND\n  3. It can be measured reliably\n\nIf measurement is not reliable, disclose in notes rather than recognising in the statements.',
      },
      {
        heading: 'Capital vs Revenue Expenditure',
        body: 'CAPITAL EXPENDITURE: creates a new non-current asset or enhances an existing one → CAPITALISE on SOFP.\nREVENUE EXPENDITURE: maintains an existing asset or covers day-to-day costs → EXPENSE to P&L.\n\nExamples:\nCapital: buying machinery, building extension, major refurbishment\nRevenue: repairs, maintenance, cleaning, replacing broken items that restore (not improve) existing condition\n\nGetting this wrong has a significant impact on both profit AND asset values.',
      },
    ],
  },

  'company-accounts': {
    title: 'Introduction to Company Accounting',
    intro: 'Companies (limited companies) have a separate legal identity from their owners. Their capital structure includes share capital, share premium, retained earnings, and potentially other reserves.',
    sections: [
      {
        heading: 'Share Capital and Share Premium',
        body: 'Shares have a NOMINAL (par) value set at issue. Shares are often issued at a PREMIUM above nominal value.\n\nExample: 10,000 shares of £1 nominal issued at £1.50 each:\n  Cash raised: 10,000 × £1.50 = £15,000\n  Ordinary Share Capital: 10,000 × £1.00 = £10,000\n  Share Premium Account: 10,000 × £0.50 = £5,000\n\nDR Cash £15,000 / CR Share Capital £10,000 / CR Share Premium £5,000\n\nShare premium is a capital reserve — it cannot be paid out as a dividend.',
        keyRules: [
          'Share capital always at NOMINAL value',
          'Excess above nominal → Share Premium Account',
          'Share premium is not distributable',
        ],
      },
      {
        heading: 'Bonus (Capitalisation) Issue',
        body: 'A bonus issue distributes EXISTING reserves to shareholders as new shares — no cash is received.\n\nFunded from: share premium, retained earnings, or other distributable reserves.\n\nExample: 1-for-4 bonus using share premium. If 1,000,000 shares outstanding:\n  New shares = 250,000 × £1.00 nominal = £250,000\n  DR Share Premium £250,000 / CR Ordinary Share Capital £250,000\n\nShareholders\' overall wealth does NOT change — they have more shares worth proportionally less each.',
      },
      {
        heading: 'Dividends',
        body: 'Dividends are appropriations of profit — they appear in the Statement of Changes in Equity, NOT the Statement of Profit or Loss.\n\nDeclared but unpaid:\n  DR Retained Earnings / CR Dividends Payable (current liability)\n\nWhen paid:\n  DR Dividends Payable / CR Cash\n\nDividends proposed AFTER year end are NOT a liability at the reporting date (IAS 10).',
      },
      {
        heading: 'Debentures (Loan Stock)',
        body: 'Debentures are long-term debt instruments. Interest on debentures is:\n  • A FINANCE COST in the statement of profit or loss (not an equity appropriation)\n  • Tax-deductible (reduces taxable profit)\n  • Accrued if unpaid at year end: DR Interest Expense / CR Interest Payable\n\nThis contrasts with dividends, which are not tax-deductible and are paid from after-tax profits.',
      },
    ],
  },

  'nca-depreciation': {
    title: 'Tangible Non-Current Assets & Depreciation',
    intro: 'Non-current assets are assets held for long-term use in the business. Depreciation spreads the cost of an asset (less residual value) over its useful life.',
    sections: [
      {
        heading: 'Capital vs Revenue Expenditure',
        body: 'CAPITAL expenditure creates or enhances a long-term asset → capitalise (appears in SOFP).\nREVENUE expenditure maintains an asset or covers operating costs → expense (appears in P&L).\n\nMistake: treating capital as revenue understates assets and overstates expenses.',
      },
      {
        heading: 'Straight Line Method',
        body: 'Annual depreciation = (Cost − Residual value) ÷ Useful life\n\nThe carrying amount declines by the same amount each year. Best for assets that wear evenly.\n\nExample: Machine cost £20,000, residual £2,000, life 9 years.\nDepreciation = (£20,000 − £2,000) ÷ 9 = £2,000 per annum.',
        keyRules: [
          'Straight line: equal charge each year',
          'Reducing balance: higher charge early, decreasing over time',
          'Always charge on cost less residual (SL) or on carrying amount (RB)',
        ],
      },
      {
        heading: 'Reducing Balance Method',
        body: 'Annual depreciation = Carrying amount × Depreciation rate\n\nThe carrying amount NEVER reaches zero under this method (unless a residual value is defined). Gives a higher charge in early years.\n\nExample: Asset carrying amount £15,000, rate 20%.\nYear 1: £15,000 × 20% = £3,000. Carrying amount = £12,000.\nYear 2: £12,000 × 20% = £2,400. Carrying amount = £9,600.',
      },
      {
        heading: 'Ledger Entries for Depreciation',
        body: 'DR Depreciation Expense (P&L)\nCR Accumulated Depreciation (SOFP — contra asset)\n\nIn the SOFP:\nNon-current asset at cost       £X\nLess accumulated depreciation  (£X)\nCarrying amount                 £X\n\nAccumulated depreciation builds up over the life of the asset.',
      },
    ],
  },

  'irrecoverable-debts': {
    title: 'Irrecoverable Debts & Allowance for Receivables',
    intro: 'Credit sales create the risk that customers will not pay. Two adjustments address this: writing off specific bad debts and creating an allowance for expected losses.',
    sections: [
      {
        heading: 'Writing Off an Irrecoverable Debt',
        body: 'When a specific debt is confirmed as uncollectable:\n\nDR Irrecoverable Debts Expense    £X\nCR Trade Receivables               £X\n\nThis removes the debt from receivables and charges the loss to P&L. The trade receivable balance must be reduced.',
        keyRules: [
          'Write off specific known bad debts → DR Irrecoverable Debts Expense',
          'Allowance = estimate for debts not yet confirmed as bad',
          'Both reduce the net receivables figure in the SOFP',
        ],
      },
      {
        heading: 'Allowance for Receivables',
        body: 'An allowance (provision) is created for receivables that may not be collected but haven\'t been written off yet.\n\nCreating/increasing the allowance:\n  DR Increase in Allowance for Receivables\n  CR Allowance for Receivables\n\nReducing the allowance:\n  DR Allowance for Receivables\n  CR Decrease in Allowance for Receivables (income)\n\nIn the SOFP: Trade Receivables less Allowance for Receivables = net figure.',
      },
      {
        heading: 'Recovering a Previously Written-Off Debt',
        body: 'If a debt previously written off is unexpectedly recovered:\n\nStep 1 — Reinstate the debt:\n  DR Trade Receivables / CR Irrecoverable Debt Recovered\n\nStep 2 — Record the cash:\n  DR Cash at Bank / CR Trade Receivables',
      },
    ],
  },

  'correction-of-errors': {
    title: 'Correction of Errors',
    intro: 'Errors in bookkeeping must be identified, classified, and corrected — sometimes through a suspense account.',
    sections: [
      {
        heading: 'Types of Error',
        body: '1. ERROR OF OMISSION — transaction completely missed from the books. Trial balance still agrees.\n\n2. ERROR OF COMMISSION — correct amount, but posted to the WRONG account of the SAME type (e.g. rent debited to electricity). Trial balance still agrees.\n\n3. ERROR OF PRINCIPLE — correct amount, but posted to the WRONG TYPE of account (e.g. machine cost debited to repairs — capital treated as revenue). Trial balance still agrees.\n\n4. COMPENSATING ERRORS — two equal and opposite errors that cancel out. Trial balance still agrees.\n\n5. ERROR OF ORIGINAL ENTRY — same wrong amount in both debit and credit entries. Trial balance still agrees.\n\n6. REVERSAL OF ENTRIES — correct accounts but DR and CR transposed. Trial balance still agrees.',
        keyRules: [
          'Errors 1-6 above do NOT affect trial balance — no suspense account needed',
          'One-sided errors DO affect trial balance → suspense account required',
          'Transposition errors create a difference divisible by 9',
        ],
      },
      {
        heading: 'Suspense Account',
        body: 'A suspense account is opened when the trial balance does NOT agree (debits ≠ credits). The difference is temporarily placed in the suspense account.\n\nAs errors are found, correcting entries are made to clear the suspense balance. The suspense account must be fully cleared before final accounts are prepared.',
      },
      {
        heading: 'Journal Entries to Correct Errors',
        body: 'Always identify:\n1. What WRONG entry was made?\n2. What CORRECT entry should have been made?\n3. What reversal/adjustment is needed?\n\nError of principle example:\nMachine cost £3,600 debited to Repairs (expense) — should be Office Equipment (asset).\nCorrection: DR Office Equipment £3,600 / CR Repairs Expense £3,600.',
      },
    ],
  },

  'control-accounts': {
    title: 'Control Accounts',
    intro: 'Control accounts (also called total accounts) are summary accounts in the nominal ledger that reconcile with the individual balances in the subsidiary ledger.',
    sections: [
      {
        heading: 'Sales Ledger Control Account (SLCA)',
        body: 'The SLCA records the TOTAL of all transactions with credit customers:\n\nDEBIT side (increases what customers owe):\n  • Credit sales\n  • Dishonoured cheques\n  • Interest charged on overdue accounts\n\nCREDIT side (reduces what customers owe):\n  • Cash/cheques received from customers\n  • Discounts allowed\n  • Returns inwards\n  • Irrecoverable debts written off\n  • Credit notes issued\n\nClosing balance = total outstanding from all customers.',
        keyRules: [
          'SLCA balance must equal the sum of all individual customer balances',
          'Differences indicate errors in either the control account or the individual ledger',
        ],
      },
      {
        heading: 'Purchase Ledger Control Account (PLCA)',
        body: 'The PLCA records the TOTAL of all transactions with credit suppliers:\n\nCREDIT side (increases what is owed):\n  • Credit purchases\n\nDEBIT side (reduces what is owed):\n  • Cash/cheques paid to suppliers\n  • Discounts received\n  • Returns outwards\n  • Contra entries (set off against SLCA if same person is both customer and supplier)\n\nClosing balance = total outstanding to all suppliers.',
      },
      {
        heading: 'Purpose of Control Accounts',
        body: '• DETECT ERRORS quickly — if the control account balance ≠ sum of individual balances, an error exists\n• PREVENT FRAUD — the person maintaining the individual accounts cannot also post to the control account\n• PROVIDE A QUICK BALANCE for debtors and creditors without adding up all individual accounts\n• Allow financial statements to be prepared without reconciling every individual balance',
      },
    ],
  },

  'incomplete-records': {
    title: 'Incomplete Records',
    intro: 'When a business has not maintained full double-entry records, figures must be reconstructed using available information and accounting equations.',
    sections: [
      {
        heading: 'The Accounting Equation Approach',
        body: 'If opening and closing capital are known, profit can be found:\n\nProfit = Closing capital − Opening capital + Drawings − Capital introduced\n\nCapital at any point = Assets − Liabilities',
      },
      {
        heading: 'Reconstructing Sales and Purchases',
        body: 'Using T-account logic:\n\nSALES (from SLCA):\n  Opening receivables + Sales = Cash received + Closing receivables\n  → Sales = Cash received + Closing receivables − Opening receivables\n\nPURCHASES (from PLCA):\n  Opening payables + Purchases = Cash paid + Closing payables\n  → Purchases = Cash paid + Closing payables − Opening payables',
        keyRules: [
          'Use the receivables T-account to find credit sales',
          'Use the payables T-account to find credit purchases',
          'Use the bank T-account to find missing cash items',
        ],
      },
      {
        heading: 'Mark-up and Margin',
        body: 'MARK-UP = Gross profit ÷ Cost of sales\nMARGIN = Gross profit ÷ Revenue\n\nExample: goods cost £80, sold for £100.\nMark-up = £20/£80 = 25% on cost\nMargin = £20/£100 = 20% on revenue\n\nUsed to estimate sales or cost of sales when records are missing.',
      },
    ],
  },

  'basic-double-entry': {
    title: 'Basic Double Entry',
    intro: 'Every transaction affects two accounts — one debit and one credit of equal value. Debits are on the left; credits are on the right. The accounting equation must always balance: Assets = Liabilities + Equity.',
    sections: [
      {
        heading: 'The Golden Rules',
        keyRules: [
          'Assets increase on the DEBIT side (go up = DR, go down = CR)',
          'Liabilities increase on the CREDIT side (go up = CR, go down = DR)',
          'Equity/Capital increases on the CREDIT side',
          'Income increases on the CREDIT side',
          'Expenses increase on the DEBIT side',
        ],
      },
      {
        heading: 'Common Transactions',
        body: 'Owner puts cash into business:\n  DR Cash at Bank / CR Capital Account\n\nBuy goods for cash:\n  DR Purchases / CR Cash at Bank\n\nBuy goods on credit:\n  DR Purchases / CR Trade Payables\n\nSell goods for cash:\n  DR Cash at Bank / CR Sales Revenue\n\nSell goods on credit:\n  DR Trade Receivables / CR Sales Revenue\n\nPay a supplier:\n  DR Trade Payables / CR Cash at Bank\n\nReceive payment from customer:\n  DR Cash at Bank / CR Trade Receivables',
      },
      {
        heading: 'Assets vs Expenses',
        body: 'A common mistake is confusing ASSETS and EXPENSES:\n\n• If an item will be used UP in one period → EXPENSE (e.g. stationery, rent)\n• If an item will provide benefit over multiple periods → ASSET (e.g. van, equipment)\n\nExample: buying a printer for the office is a NON-CURRENT ASSET, not an expense.',
        keyRules: [
          'Capital expenditure = buying assets — goes on the balance sheet',
          'Revenue expenditure = day-to-day costs — goes on the income statement',
        ],
      },
      {
        heading: 'The Trial Balance',
        body: 'A trial balance lists all ledger account balances at a point in time. Debit balances = Assets and Expenses. Credit balances = Liabilities, Equity and Income.\n\nIf the totals agree, the double-entry is arithmetically correct — but errors of principle, omission, or commission can still exist.',
      },
    ],
  },

  'inventory': {
    title: 'Inventory (IAS 2)',
    intro: 'Inventory is measured at the LOWER of cost and net realisable value (NRV). This applies the prudence concept — never overstate assets.',
    sections: [
      {
        heading: 'Cost of Inventory',
        body: 'Cost includes:\n• Purchase price (less trade discounts)\n• Import duties and irrecoverable taxes\n• Transport and handling costs directly attributable\n\nNOT included in cost:\n• Selling costs\n• Administrative overheads unrelated to bringing goods to their present location\n• Abnormal waste',
        keyRules: [
          'FIFO (First In, First Out) — oldest stock assumed sold first',
          'AVCO (Weighted Average Cost) — cost per unit recalculated after each purchase',
          'LIFO is NOT permitted under IAS 2',
        ],
      },
      {
        heading: 'Net Realisable Value',
        body: 'NRV = Estimated selling price − Estimated costs to complete − Estimated costs to sell\n\nIf NRV < Cost, write the inventory DOWN to NRV:\n  DR Cost of Sales (or Inventory Write-down) / CR Inventory\n\nIf NRV recovers in a later period, the write-down can be REVERSED (but only up to original cost).',
      },
      {
        heading: 'Inventory in the Financial Statements',
        body: 'Opening inventory + Purchases = Goods available for sale\nGoods available for sale − Closing inventory = Cost of sales\n\nClosing inventory appears on the SOFP as a current asset.\nIts value directly affects gross profit — higher closing inventory = lower cost of sales = higher profit.',
        keyRules: [
          'Overstating closing inventory OVERSTATES profit',
          'Understating closing inventory UNDERSTATES profit',
        ],
      },
      {
        heading: 'FIFO vs AVCO in Rising Prices',
        body: 'When prices are RISING:\n• FIFO gives HIGHER closing inventory and HIGHER profit (older, cheaper costs go to cost of sales)\n• AVCO gives a value between the two extremes\n\nWhen prices are FALLING, the opposite applies.',
      },
    ],
  },

  'accruals': {
    title: 'Accruals',
    intro: 'An accrual is an expense that has been INCURRED in the period but NOT yet invoiced or paid. It is recognised in the income statement for the period it relates to (accruals basis of accounting).',
    sections: [
      {
        heading: 'Journal Entry',
        body: 'To recognise an accrual at year end:\n  DR Expense Account (e.g. Electricity)\n  CR Accruals (current liability)\n\nIn the next period, when the invoice arrives and is paid:\n  DR Accruals / CR Cash (clearing the liability)\n  DR Expense / CR Cash (if cash exceeds the accrual — the excess is this period\'s expense)\n\nSimplified: the accrual account reverses at the start of the new period.',
        keyRules: [
          'Accrual = current liability on the SOFP',
          'Matching principle: charge expense in the period the benefit is received',
        ],
      },
      {
        heading: 'Calculating the Accrual',
        body: 'Example: Gas bill covers Apr–Sep (£600) and Oct–Mar (£900). Year end is 31 Dec.\n\nOct–Dec = 3 months of Oct–Mar bill:\nAccrual = £900 × 3/6 = £450\n\nIncome statement charge = £600 (Apr–Sep invoice) + £450 (accrual) = £1,050',
      },
      {
        heading: 'Accruals vs Accrued Income',
        body: 'Do not confuse:\n• ACCRUALS (accrued expenses) — money OWED by the business → current liability\n• ACCRUED INCOME — income EARNED but not yet received → current asset\n\nAccrued income journal:\n  DR Accrued Income (current asset) / CR Income Account',
      },
    ],
  },

  'prepayments': {
    title: 'Prepayments',
    intro: 'A prepayment is a payment made in advance for a benefit that will be received in a FUTURE period. The prepaid portion is an asset — the business has paid for something it hasn\'t received yet.',
    sections: [
      {
        heading: 'Journal Entry',
        body: 'At year end, remove the prepaid portion from expenses:\n  DR Prepayments (current asset)\n  CR Expense Account\n\nThis reduces the expense in the current period and carries the prepaid amount forward as an asset.',
        keyRules: [
          'Prepayment = current asset on the SOFP',
          'The expense charge = cash paid − prepayment (+ opening prepayment)',
        ],
      },
      {
        heading: 'Calculating the Prepayment',
        body: 'Example: Insurance paid on 1 Oct — £1,200 covers 12 months. Year end 31 Dec.\n\nMonths remaining after year end = 9 (Jan–Sep)\nPrepayment = £1,200 × 9/12 = £900\n\nThis period\'s expense = £1,200 − £900 = £300 (Oct–Dec only)',
      },
      {
        heading: 'Opening and Closing Prepayments in T-Accounts',
        body: 'Expense Account:\n  DR: Cash paid\n  DR: Opening prepayment b/d (from prior year)\n  CR: Closing prepayment c/d (this year\'s prepayment)\n  CR: Balance = Income statement charge\n\nThe income statement charge = cash paid + opening prepayment − closing prepayment.',
      },
    ],
  },

  'allowance-receivables': {
    title: 'Allowance for Receivables',
    intro: 'An allowance for receivables (also called provision for doubtful debts) reduces trade receivables to the amount expected to be collected. It applies the prudence concept.',
    sections: [
      {
        heading: 'Creating the Allowance',
        body: 'When first creating an allowance:\n  DR Irrecoverable Debt Expense\n  CR Allowance for Receivables\n\nThe allowance sits on the SOFP as a deduction from trade receivables:\n  Trade receivables          £50,000\n  Less: Allowance            (£2,500)\n  Net receivables            £47,500',
        keyRules: [
          'Specific allowance — for a named customer with a known risk',
          'General allowance — % of remaining receivables based on experience (e.g. 2% of outstanding balances)',
        ],
      },
      {
        heading: 'Adjusting the Allowance',
        body: 'Only the CHANGE in allowance hits the income statement each year:\n\n• If allowance INCREASES → DR Expense / CR Allowance (extra charge)\n• If allowance DECREASES → DR Allowance / CR Expense (credit — reduces the charge)\n\nExample: Allowance last year £3,000, required this year £3,800.\nAdjustment = DR Expense £800 / CR Allowance £800',
      },
      {
        heading: 'Allowance vs Irrecoverable Debt',
        body: 'IRRECOVERABLE DEBT — a specific debt is written OFF (certain it won\'t be paid):\n  DR Irrecoverable Debt Expense / CR Trade Receivables\n\nALLOWANCE — a general or specific ESTIMATE of amounts that MIGHT not be collected. The debt is not yet removed from receivables — just provided against.\n\nOrder of operations: write off specific bad debts first, THEN apply any % allowance to the remaining balance.',
      },
    ],
  },

  'financial-statements': {
    title: 'Financial Statements',
    intro: 'The three core financial statements are the Statement of Profit or Loss (SOPL), Statement of Financial Position (SOFP), and Statement of Cash Flows. Together they give a complete picture of financial performance and position.',
    sections: [
      {
        heading: 'Statement of Profit or Loss (Income Statement)',
        body: 'Revenue\n− Cost of sales\n= GROSS PROFIT\n− Distribution costs\n− Administrative expenses\n= OPERATING PROFIT\n± Finance income / (costs)\n= PROFIT BEFORE TAX\n− Tax\n= PROFIT FOR THE YEAR',
        keyRules: [
          'Cost of sales = Opening inventory + Purchases − Closing inventory',
          'Gross profit margin = Gross profit ÷ Revenue × 100',
        ],
      },
      {
        heading: 'Statement of Financial Position (Balance Sheet)',
        body: 'NON-CURRENT ASSETS\n  Property, plant & equipment (at NBV)\n  Intangible assets\n\nCURRENT ASSETS\n  Inventory\n  Trade receivables (net of allowance)\n  Prepayments\n  Cash and cash equivalents\n\nEQUITY\n  Share capital\n  Retained earnings\n\nNON-CURRENT LIABILITIES\n  Long-term borrowings\n\nCURRENT LIABILITIES\n  Trade payables\n  Accruals\n  Tax payable',
        keyRules: [
          'Assets = Equity + Liabilities (the accounting equation always balances)',
          'Current = due within 12 months; non-current = due after 12 months',
        ],
      },
      {
        heading: 'Statement of Changes in Equity',
        body: 'Shows movements in equity during the year:\n\nOpening equity\n+ Profit for the year (from SOPL)\n+ New shares issued\n− Dividends paid\n= Closing equity\n\nClosing equity must agree with the SOFP.',
      },
      {
        heading: 'Preparing from a Trial Balance',
        body: 'Steps:\n1. Identify all adjustments (accruals, prepayments, depreciation, bad debts)\n2. Apply adjustments to the trial balance figures\n3. Allocate adjusted figures: SOPL items (income/expense) or SOFP items (asset/liability)\n4. Calculate retained earnings: opening RE + profit − dividends',
      },
    ],
  },

  'intangible-assets': {
    title: 'Intangible Assets (IAS 38)',
    intro: 'Intangible assets are non-monetary assets without physical substance — for example, patents, trademarks, customer lists, and goodwill. They must meet the recognition criteria to appear on the balance sheet.',
    sections: [
      {
        heading: 'Recognition Criteria',
        body: 'An intangible asset is recognised only if:\n1. It is IDENTIFIABLE (separable or arises from contractual/legal rights)\n2. The entity controls it\n3. Future economic benefits are expected to flow from it\n4. The cost can be measured reliably',
        keyRules: [
          'Internally generated goodwill is NEVER recognised',
          'Internally generated brands, mastheads, customer lists — NEVER recognised',
          'Research costs — EXPENSED as incurred',
          'Development costs — can be CAPITALISED if 6 criteria are met (PIRATE mnemonic)',
        ],
      },
      {
        heading: 'Research vs Development',
        body: 'RESEARCH — original investigation to gain new knowledge. Always expensed.\n\nDEVELOPMENT — applying research to produce new products/processes. Capitalise if ALL of these are met (PIRATE):\n  P — Probable future economic benefits\n  I — Intention to complete\n  R — Resources available to complete\n  A — Ability to use or sell the asset\n  T — Technical feasibility of completing\n  E — Expenditure can be reliably measured',
      },
      {
        heading: 'Amortisation',
        body: 'Intangible assets with a FINITE useful life must be amortised (like depreciation):\n  DR Amortisation expense / CR Accumulated amortisation\n\nIf an intangible has an INDEFINITE useful life (e.g. some acquired trademarks), it is NOT amortised but is tested for impairment annually.',
      },
    ],
  },

  'consolidation': {
    title: 'Consolidation (Group Accounts)',
    intro: 'When a parent company controls a subsidiary (owns >50% of voting shares), it must prepare consolidated financial statements combining both entities as if they were a single economic unit.',
    sections: [
      {
        heading: 'Key Definitions',
        keyRules: [
          'Parent — holds control over another entity',
          'Subsidiary — controlled by the parent (typically >50% ownership)',
          'Non-controlling interest (NCI) — the minority share of the subsidiary NOT owned by the parent',
          'Goodwill — premium paid above fair value of net assets acquired',
        ],
      },
      {
        heading: 'Goodwill Calculation',
        body: 'Goodwill at acquisition:\n\nConsideration paid by parent\n+ Fair value of NCI at acquisition\n− Fair value of net assets acquired\n= GOODWILL\n\nGoodwill is carried on the consolidated SOFP at cost less impairment. It is NOT amortised under IFRS — tested annually for impairment.',
      },
      {
        heading: 'Consolidated SOFP — Key Adjustments',
        body: '1. Add parent and subsidiary assets/liabilities line by line\n2. Remove the parent\'s investment in subsidiary (cancel against subsidiary equity)\n3. Show NCI as a separate component of equity\n4. Eliminate intra-group balances (e.g. parent owes subsidiary)\n5. Eliminate unrealised profit on intra-group transactions',
        keyRules: [
          'Intra-group sales: remove from revenue and cost of sales',
          'Unrealised profit in closing inventory: DR Retained earnings / CR Inventory',
        ],
      },
      {
        heading: 'Pre- and Post-Acquisition Profits',
        body: 'Only POST-ACQUISITION profits of the subsidiary are included in consolidated retained earnings.\n\nPre-acquisition profits are part of the net assets at acquisition (used in the goodwill calculation) and do NOT flow into the consolidated income statement.',
      },
    ],
  },

  'regulatory-framework': {
    title: 'Regulatory Framework',
    intro: 'Financial reporting is governed by a framework of standards, regulations, and bodies that ensure consistent, comparable, and transparent financial information.',
    sections: [
      {
        heading: 'Key Bodies',
        keyRules: [
          'IASB (International Accounting Standards Board) — issues IFRS globally',
          'IFRS Foundation — oversees IASB',
          'IFRS Advisory Council — advises IASB on agenda and priorities',
          'IFRS Interpretations Committee — interprets existing standards',
          'FRC (Financial Reporting Council) — UK regulator',
        ],
      },
      {
        heading: 'Hierarchy of Standards',
        body: 'IFRS (International Financial Reporting Standards) — current standards issued by IASB\nIAS (International Accounting Standards) — older standards, many still in force\n\nWhen no specific standard applies, an entity uses the Conceptual Framework as a guide.',
      },
      {
        heading: 'Advantages of a Regulatory Framework',
        keyRules: [
          'Comparability — users can compare financial statements across companies and periods',
          'Consistency — same treatment for similar transactions',
          'Transparency — reduces information asymmetry between preparers and users',
          'Accountability — directors must present a true and fair view',
        ],
      },
      {
        heading: 'True and Fair Override',
        body: 'In rare circumstances, strict compliance with a standard may give a misleading picture. Entities may depart from a standard to give a true and fair view, but must disclose:\n• That departure was necessary\n• The nature of the departure\n• Its financial effect',
      },
    ],
  },

  'cash-management': {
    title: 'Cash Management',
    intro: 'Cash management focuses on ensuring a business has sufficient liquidity to meet obligations when they fall due. Profit does not equal cash — a profitable business can still fail through poor cash management.',
    sections: [
      {
        heading: 'Profit vs Cash',
        body: 'Reasons why profit ≠ cash flow:\n\n• Non-cash expenses (depreciation, amortisation)\n• Timing differences (credit sales/purchases not yet settled)\n• Capital expenditure (reduces cash but not profit)\n• Loan repayments (reduce cash but not profit)\n• Working capital changes (more inventory ties up cash)',
        keyRules: [
          'Depreciation is added BACK in the cash flow statement (non-cash)',
          'An increase in receivables REDUCES operating cash flow',
          'An increase in payables INCREASES operating cash flow',
        ],
      },
      {
        heading: 'Working Capital Cycle',
        body: 'Cash → Buy raw materials → Manufacture → Sell on credit → Receive cash\n\nThe CASH OPERATING CYCLE measures how long cash is tied up:\n\nInventory days + Receivables days − Payables days = Cash cycle (days)\n\nA shorter cycle = better liquidity. Strategies to shorten:\n• Reduce inventory holding period (just-in-time)\n• Collect from customers faster (early payment discounts)\n• Extend payment terms with suppliers',
      },
      {
        heading: 'Cash Flow Forecasting',
        body: 'A cash budget shows expected receipts and payments month by month. Key items:\n\nRECEIPTS: cash sales, collections from receivables, loans received, asset disposal proceeds\nPAYMENTS: cash purchases, supplier payments, wages, overheads, loan repayments, tax, capital expenditure\n\nOpening cash + Net cash flow = Closing cash balance',
      },
    ],
  },

  'related-parties': {
    title: 'Related Parties & Disclosure (IAS 24)',
    intro: 'A related party relationship exists when one party has the ability to control or significantly influence another. IAS 24 requires disclosure of related party transactions to prevent users being misled.',
    sections: [
      {
        heading: 'Who is a Related Party?',
        keyRules: [
          'Parent and subsidiary companies',
          'Fellow subsidiaries (common parent)',
          'Associates (significant influence: 20–50% ownership)',
          'Key management personnel (directors and senior management)',
          'Close family members of key management',
          'Entities controlled by key management or their families',
        ],
      },
      {
        heading: 'What Must Be Disclosed?',
        body: 'For each category of related party, disclose:\n• Nature of the relationship\n• Amount of transactions during the period\n• Outstanding balances at year end\n• Terms and conditions (including security and settlement)\n• Allowances for doubtful debts on outstanding balances',
        keyRules: [
          'Disclosure is required even if no price was charged (e.g. services provided free)',
          'The claim that transactions were on "arm\'s length" terms must be substantiated',
        ],
      },
      {
        heading: 'Why It Matters',
        body: 'Related party transactions may NOT be on commercial terms. A director selling their personal asset to the company at inflated value artificially increases the company\'s asset base.\n\nDisclosure allows financial statement users to:\n• Assess whether transactions distort the financial position\n• Identify potential conflicts of interest\n• Make informed decisions about the entity',
      },
    ],
  },

  'ratio-analysis': {
    title: 'Interpretation of Financial Statements',
    intro: 'Ratios help users assess profitability, liquidity, and efficiency. Always interpret ratios in context — compare to prior periods and industry averages.',
    sections: [
      {
        heading: 'Profitability Ratios',
        body: 'GROSS PROFIT MARGIN = (Gross profit ÷ Revenue) × 100\n\nNET PROFIT MARGIN = (Profit before tax ÷ Revenue) × 100\n\nRETURN ON CAPITAL EMPLOYED (ROCE) = (Profit before interest and tax ÷ Capital employed) × 100\n  Capital employed = Total equity + Non-current liabilities',
        keyRules: [
          'Higher margin = more profitable per £ of sales',
          'ROCE measures overall return on long-term funding',
        ],
      },
      {
        heading: 'Liquidity Ratios',
        body: 'CURRENT RATIO = Current assets ÷ Current liabilities\n  (ideal: around 2:1, though varies by industry)\n\nQUICK RATIO (ACID TEST) = (Current assets − Inventory) ÷ Current liabilities\n  (ideal: around 1:1 — excludes less liquid inventory)',
      },
      {
        heading: 'Efficiency Ratios',
        body: 'INVENTORY DAYS = (Inventory ÷ Cost of sales) × 365\n  (how many days stock is held before sale)\n\nRECEIVABLES DAYS = (Trade receivables ÷ Revenue) × 365\n  (how long customers take to pay)\n\nPAYABLES DAYS = (Trade payables ÷ Cost of sales) × 365\n  (how long it takes to pay suppliers)\n\nCASH OPERATING CYCLE = Inventory days + Receivables days − Payables days',
      },
      {
        heading: 'Gearing',
        body: 'GEARING = Non-current liabilities ÷ (Non-current liabilities + Equity) × 100\n\nHigh gearing = more debt relative to equity = higher financial risk. Interest must be paid regardless of profit. In a recession, highly geared companies are more vulnerable.',
      },
    ],
  },

};
