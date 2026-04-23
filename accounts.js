/**
 * ACCA F3 Financial Accounting — Master Account Name List
 * =========================================================
 * This is the definitive pool of account names used across all
 * journal entry exercises in the quiz app.
 *
 * Each account has:
 *   name    — the exact account name shown in dropdowns
 *   cat     — category: "asset" | "liability" | "equity" | "income" | "expense" | "contra"
 *   section — which part of the financial statements it belongs to
 *   tags    — array of flags:
 *               "rh"   = red herring (plausible but often wrong)
 *               "exam" = high exam frequency (appears often in ACCA F3 questions)
 *               "co"   = companies only (not used in sole trader exercises)
 *   normal  — which side is the NORMAL balance: "debit" | "credit"
 *             (used by the app to auto-check entries)
 */

const ACCOUNTS = [

  // ─── NON-CURRENT ASSETS ───────────────────────────────────────────────────

  { name: "Land (at cost)",                             cat: "asset",    section: "nca",       tags: [],             normal: "debit"  },
  { name: "Land (at valuation)",                        cat: "asset",    section: "nca",       tags: ["exam"],       normal: "debit"  },
  { name: "Buildings (at cost)",                        cat: "asset",    section: "nca",       tags: [],             normal: "debit"  },
  { name: "Buildings (at valuation)",                   cat: "asset",    section: "nca",       tags: ["exam"],       normal: "debit"  },
  { name: "Plant and Machinery (at cost)",              cat: "asset",    section: "nca",       tags: [],             normal: "debit"  },
  { name: "Motor Vehicles (at cost)",                   cat: "asset",    section: "nca",       tags: [],             normal: "debit"  },
  { name: "Fixtures and Fittings (at cost)",            cat: "asset",    section: "nca",       tags: [],             normal: "debit"  },
  { name: "Shop Fittings (at cost)",                    cat: "asset",    section: "nca",       tags: [],             normal: "debit"  },
  { name: "Office Equipment (at cost)",                 cat: "asset",    section: "nca",       tags: [],             normal: "debit"  },
  { name: "Computer Equipment (at cost)",               cat: "asset",    section: "nca",       tags: [],             normal: "debit"  },
  { name: "Goodwill",                                   cat: "asset",    section: "nca",       tags: ["co"],         normal: "debit"  },
  { name: "Development Expenditure",                    cat: "asset",    section: "nca",       tags: ["exam"],       normal: "debit"  },
  { name: "Investments (non-current)",                  cat: "asset",    section: "nca",       tags: [],             normal: "debit"  },
  { name: "Investment in Subsidiary",                   cat: "asset",    section: "nca",       tags: ["co"],         normal: "debit"  },

  // ─── ACCUMULATED DEPRECIATION / AMORTISATION (contra assets) ─────────────

  { name: "Accumulated Depreciation — Buildings",       cat: "contra",   section: "nca",       tags: ["exam"],       normal: "credit" },
  { name: "Accumulated Depreciation — Plant and Machinery", cat: "contra", section: "nca",     tags: ["exam"],       normal: "credit" },
  { name: "Accumulated Depreciation — Motor Vehicles",  cat: "contra",   section: "nca",       tags: ["exam"],       normal: "credit" },
  { name: "Accumulated Depreciation — Fixtures and Fittings", cat: "contra", section: "nca",  tags: [],             normal: "credit" },
  { name: "Accumulated Amortisation — Development Expenditure", cat: "contra", section: "nca", tags: [],            normal: "credit" },
  { name: "Accumulated Amortisation — Goodwill",        cat: "contra",   section: "nca",       tags: ["rh"],         normal: "credit" },

  // ─── CURRENT ASSETS ───────────────────────────────────────────────────────

  { name: "Inventory",                                  cat: "asset",    section: "ca",        tags: ["exam"],       normal: "debit"  },
  { name: "Trade Receivables",                          cat: "asset",    section: "ca",        tags: ["exam"],       normal: "debit"  },
  { name: "Cash at Bank",                               cat: "asset",    section: "ca",        tags: [],             normal: "debit"  },
  { name: "Cash in Hand / Petty Cash",                  cat: "asset",    section: "ca",        tags: [],             normal: "debit"  },
  { name: "Prepayments",                                cat: "asset",    section: "ca",        tags: ["exam"],       normal: "debit"  },
  { name: "Accrued Income",                             cat: "asset",    section: "ca",        tags: ["exam"],       normal: "debit"  },
  { name: "Allowance for Receivables",                  cat: "contra",   section: "ca",        tags: ["exam"],       normal: "credit" },
  { name: "Sales Tax Recoverable",                      cat: "asset",    section: "ca",        tags: [],             normal: "debit"  },
  { name: "Investments (short-term)",                   cat: "asset",    section: "ca",        tags: [],             normal: "debit"  },

  // ─── NON-CURRENT LIABILITIES ──────────────────────────────────────────────

  { name: "Bank Loan (non-current)",                    cat: "liability", section: "ncl",      tags: [],             normal: "credit" },
  { name: "Mortgage",                                   cat: "liability", section: "ncl",      tags: [],             normal: "credit" },
  { name: "Loan Stock / Debentures",                    cat: "liability", section: "ncl",      tags: ["co"],         normal: "credit" },
  { name: "Long-Term Provisions",                       cat: "liability", section: "ncl",      tags: ["exam"],       normal: "credit" },
  { name: "Deferred Tax Liability",                     cat: "liability", section: "ncl",      tags: ["rh"],         normal: "credit" },

  // ─── CURRENT LIABILITIES ──────────────────────────────────────────────────

  { name: "Trade Payables",                             cat: "liability", section: "cl",       tags: ["exam"],       normal: "credit" },
  { name: "Accruals",                                   cat: "liability", section: "cl",       tags: ["exam"],       normal: "credit" },
  { name: "Bank Overdraft",                             cat: "liability", section: "cl",       tags: ["exam"],       normal: "credit" },
  { name: "Sales Tax Payable",                          cat: "liability", section: "cl",       tags: [],             normal: "credit" },
  { name: "Sales Tax Control Account",                  cat: "contra",   section: "cl",        tags: [],             normal: "credit" },
  { name: "Deferred Income",                            cat: "liability", section: "cl",       tags: ["exam"],       normal: "credit" },
  { name: "Provision for Warranty Claims",              cat: "liability", section: "cl",       tags: ["exam"],       normal: "credit" },
  { name: "Dividends Payable",                          cat: "liability", section: "cl",       tags: ["co"],         normal: "credit" },
  { name: "Interest Payable",                           cat: "liability", section: "cl",       tags: [],             normal: "credit" },
  { name: "Income Tax Payable",                         cat: "liability", section: "cl",       tags: ["co", "rh"],   normal: "credit" },
  { name: "Short-Term Loan",                            cat: "liability", section: "cl",       tags: [],             normal: "credit" },

  // ─── EQUITY / CAPITAL ─────────────────────────────────────────────────────

  { name: "Capital Account",                            cat: "equity",   section: "equity",    tags: [],             normal: "credit" },
  { name: "Drawings Account",                           cat: "equity",   section: "equity",    tags: ["exam", "rh"], normal: "debit"  },
  { name: "Retained Earnings",                          cat: "equity",   section: "equity",    tags: ["exam", "co"], normal: "credit" },
  { name: "Revaluation Surplus",                        cat: "equity",   section: "equity",    tags: ["exam"],       normal: "credit" },
  { name: "Profit or Loss Account",                     cat: "equity",   section: "equity",    tags: ["exam"],       normal: "credit" },
  { name: "Ordinary Share Capital",                     cat: "equity",   section: "equity",    tags: ["co"],         normal: "credit" },
  { name: "Preference Share Capital",                   cat: "equity",   section: "equity",    tags: ["co", "rh"],   normal: "credit" },
  { name: "Share Premium Account",                      cat: "equity",   section: "equity",    tags: ["co"],         normal: "credit" },
  { name: "General Reserve",                            cat: "equity",   section: "equity",    tags: ["co"],         normal: "credit" },
  { name: "Non-Controlling Interest (NCI)",             cat: "equity",   section: "equity",    tags: ["co", "rh"],   normal: "credit" },
  { name: "Suspense Account",                           cat: "contra",   section: "special",   tags: ["exam", "rh"], normal: null      },

  // ─── INCOME ───────────────────────────────────────────────────────────────

  { name: "Sales Revenue",                              cat: "income",   section: "spl",       tags: ["exam"],       normal: "credit" },
  { name: "Sales Returns",                              cat: "income",   section: "spl",       tags: [],             normal: "debit"  },
  { name: "Discount Received",                          cat: "income",   section: "spl",       tags: ["exam"],       normal: "credit" },
  { name: "Rental Income",                              cat: "income",   section: "spl",       tags: [],             normal: "credit" },
  { name: "Interest Received",                          cat: "income",   section: "spl",       tags: [],             normal: "credit" },
  { name: "Dividend Income",                            cat: "income",   section: "spl",       tags: [],             normal: "credit" },
  { name: "Profit on Disposal of NCA",                  cat: "income",   section: "spl",       tags: ["exam"],       normal: "credit" },
  { name: "Irrecoverable Debt Recovered",               cat: "income",   section: "spl",       tags: ["exam"],       normal: "credit" },
  { name: "Subscription Income",                        cat: "income",   section: "spl",       tags: [],             normal: "credit" },
  { name: "Commission Receivable",                      cat: "income",   section: "spl",       tags: [],             normal: "credit" },

  // ─── COST OF SALES / PURCHASES ────────────────────────────────────────────

  { name: "Purchases",                                  cat: "expense",  section: "cos",       tags: ["exam"],       normal: "debit"  },
  { name: "Purchase Returns",                           cat: "expense",  section: "cos",       tags: [],             normal: "credit" },
  { name: "Carriage Inwards",                           cat: "expense",  section: "cos",       tags: ["exam", "rh"], normal: "debit"  },
  { name: "Opening Inventory",                          cat: "expense",  section: "cos",       tags: [],             normal: "debit"  },
  { name: "Closing Inventory (credit to P/L)",          cat: "income",   section: "cos",       tags: ["exam"],       normal: "credit" },
  { name: "Import Duties",                              cat: "expense",  section: "cos",       tags: ["rh"],         normal: "debit"  },

  // ─── OPERATING EXPENSES ───────────────────────────────────────────────────

  { name: "Wages and Salaries",                         cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Rent Expense",                               cat: "expense",  section: "spl",       tags: ["exam"],       normal: "debit"  },
  { name: "Rates / Local Taxes",                        cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Electricity / Utilities",                    cat: "expense",  section: "spl",       tags: ["exam"],       normal: "debit"  },
  { name: "Telephone Expenses",                         cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Motor Expenses",                             cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Advertising Expenses",                       cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Stationery and Postage",                     cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Cleaning Expenses",                          cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Insurance Expense",                          cat: "expense",  section: "spl",       tags: ["exam"],       normal: "debit"  },
  { name: "General Expenses",                           cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Repairs and Maintenance",                    cat: "expense",  section: "spl",       tags: ["rh"],         normal: "debit"  },
  { name: "Audit Fees",                                 cat: "expense",  section: "spl",       tags: ["co"],         normal: "debit"  },

  // ─── FINANCIAL AND ADJUSTING EXPENSES ────────────────────────────────────

  { name: "Depreciation Expense",                       cat: "expense",  section: "spl",       tags: ["exam"],       normal: "debit"  },
  { name: "Amortisation Expense",                       cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Irrecoverable Debts Expense",                cat: "expense",  section: "spl",       tags: ["exam"],       normal: "debit"  },
  { name: "Increase in Allowance for Receivables",      cat: "expense",  section: "spl",       tags: ["exam"],       normal: "debit"  },
  { name: "Decrease in Allowance for Receivables",      cat: "income",   section: "spl",       tags: ["exam", "rh"], normal: "credit" },
  { name: "Bank Charges",                               cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Interest Expense",                           cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Loan Interest Expense",                      cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Discount Allowed",                           cat: "expense",  section: "spl",       tags: ["exam"],       normal: "debit"  },
  { name: "Warranty / Provision Expense",               cat: "expense",  section: "spl",       tags: ["exam"],       normal: "debit"  },
  { name: "Loss on Disposal of NCA",                    cat: "expense",  section: "spl",       tags: ["exam"],       normal: "debit"  },
  { name: "Research and Development Expense",           cat: "expense",  section: "spl",       tags: [],             normal: "debit"  },
  { name: "Carriage Outwards",                          cat: "expense",  section: "spl",       tags: ["rh"],         normal: "debit"  },
  { name: "Income Tax Expense",                         cat: "expense",  section: "spl",       tags: ["co", "rh"],   normal: "debit"  },

  // ─── SPECIAL PROCESS ACCOUNTS ─────────────────────────────────────────────

  { name: "Disposal Account",                           cat: "contra",   section: "special",   tags: ["exam"],       normal: null     },
  { name: "Receivables Control Account",                cat: "contra",   section: "special",   tags: ["exam"],       normal: "debit"  },
  { name: "Payables Control Account",                   cat: "contra",   section: "special",   tags: ["exam"],       normal: "credit" },
  { name: "Profit or Loss Account (closing entries)",   cat: "contra",   section: "special",   tags: [],             normal: null     },
  { name: "Petty Cash Imprest Account",                 cat: "asset",    section: "ca",        tags: [],             normal: "debit"  },

];

/**
 * Helper: get accounts by category
 * Usage: getByCategory("asset")
 */
function getByCategory(cat) {
  return ACCOUNTS.filter(a => a.cat === cat);
}

/**
 * Helper: get accounts by tag
 * Usage: getByTag("exam")  or  getByTag("rh")
 */
function getByTag(tag) {
  return ACCOUNTS.filter(a => a.tags.includes(tag));
}

/**
 * Helper: get accounts for a specific question
 * Pass the correct account names, and it will add red herrings
 * from the same categories to build the dropdown pool.
 *
 * Usage:
 *   buildDropdownPool(["Depreciation Expense", "Accumulated Depreciation — Buildings"], 4)
 *   Returns the 2 correct accounts + 4 red herring accounts
 */
function buildDropdownPool(correctNames, redHerringCount = 4) {
  const correct = ACCOUNTS.filter(a => correctNames.includes(a.name));
  const correctCats = [...new Set(correct.map(a => a.cat))];

  // Prioritise tagged red herrings, then fill from same categories
  const redHerrings = ACCOUNTS
    .filter(a => !correctNames.includes(a.name))
    .filter(a => a.tags.includes("rh") || correctCats.includes(a.cat))
    .sort(() => Math.random() - 0.5)
    .slice(0, redHerringCount);

  return [...correct, ...redHerrings].sort(() => Math.random() - 0.5);
}

// Export for use in app.js and questions.js
// (When building for the browser, these will be available as globals)
