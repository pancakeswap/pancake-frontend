// Mapping from the compounding frequency button index to actual compounding frequency
// in number of compounds per day
export const compoundingIndexToFrequency: { [key: number]: number } = {
  0: 0.5, // 12h
  1: 1, // 1d
  2: 7, // 7d
  3: 30, // 30 days
};

export const spanIndexToSpan: { [key: number]: number } = {
  0: 1, // 1d
  1: 7, // 7d
  2: 30, // 30d
  3: 365, // 1y
  4: 730, // 1y
};

export const PRICE_FIXED_DIGITS = 8;
