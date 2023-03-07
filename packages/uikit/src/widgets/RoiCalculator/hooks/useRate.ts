import { Fraction, JSBI, ONE_HUNDRED_PERCENT, ZERO_PERCENT, Percent } from "@pancakeswap/sdk";
import { useMemo } from "react";

interface Params {
  // interest accrued in usd within 24h
  interest?: Fraction;
  // in usd
  principal?: Fraction;

  // Compound frequency in days, e.g. 1 means compound every day
  compoundEvery?: number;
}

// @see https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
export function useRate({ interest, principal, compoundEvery = 1 }: Params) {
  return useMemo(() => {
    if (!interest || !principal) {
      return ZERO_PERCENT;
    }

    const ratePerPeriod = principal.add(interest.multiply(compoundEvery)).divide(principal);
    const compoundTimes = JSBI.BigInt(Math.floor(365 / compoundEvery));
    return new Percent(
      JSBI.exponentiate(ratePerPeriod.numerator, compoundTimes),
      JSBI.exponentiate(ratePerPeriod.denominator, compoundTimes)
    ).subtract(ONE_HUNDRED_PERCENT);
  }, [interest, principal, compoundEvery]);
}
