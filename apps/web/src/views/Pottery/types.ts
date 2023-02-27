export enum POT_CATEGORY {
  Deposit = 0,
  Claim = 1,
}

export enum CalculatorMode {
  WIN_RATE_BASED_ON_PRINCIPAL, // User edits principal value and sees what win rate they get
  PRINCIPAL_BASED_ON_WIN_RATE, // User edits win rate value and sees what principal they need to invest to reach it
}

export enum EditingCurrency {
  TOKEN,
  USD,
}
