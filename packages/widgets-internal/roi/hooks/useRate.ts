import { ZERO_PERCENT } from "@pancakeswap/sdk";
import { useMemo } from "react";

import { formatFraction } from "@pancakeswap/utils/formatFractions";
import { getAccrued } from "../aprHelper";
import { floatToPercent as formatDecimalToPercent } from "../utils";

interface Params extends AprParams {
  // Num of days staked
  stakeFor?: number;
  cakeInterest?: number;
}

// @see https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
export function useRate({ stakeFor = 1, ...rest }: Params) {
  const { apr, apy } = useApr({ ...rest, interest: (rest.interest ?? 0) + (rest?.cakeInterest ?? 0) });
  const { principal, compoundEvery, compoundOn } = rest;
  const accrued = useMemo(() => {
    if (!principal) {
      return 0;
    }
    const aprAsDecimal = parseFloat(formatFraction(apr.asFraction, 6) || "0");

    return getAccrued(principal, aprAsDecimal, compoundOn ? compoundEvery : 0, stakeFor);
  }, [apr, principal, stakeFor, compoundEvery, compoundOn]);

  const reward = useMemo(() => {
    if (!principal || !accrued) {
      return 0;
    }
    return accrued - principal;
  }, [accrued, principal]);

  const rate = useMemo(() => {
    if (!accrued || !principal) {
      return ZERO_PERCENT;
    }

    const decimal = (accrued - principal) / principal;
    return formatDecimalToPercent(decimal);
  }, [principal, accrued]);

  return {
    reward,
    rate,
    apr,
    apy,
  };
}

export interface AprParams {
  // interest accrued in usd within 24h
  interest?: number;
  // in usd
  principal?: number;

  // Num of days staked
  stakeFor?: number;

  // Compound frequency in days, e.g. 1 means compound every day
  compoundEvery?: number;

  // Enable compound
  compoundOn?: boolean;
}

export function useApr({ interest, principal, compoundEvery = 1, compoundOn = true }: Params) {
  return useMemo(() => {
    if (!interest || !principal) {
      return {
        apr: ZERO_PERCENT,
        apy: ZERO_PERCENT,
      };
    }

    const aprDecimal = (principal + interest * 365) / principal - 1;
    const apr = formatDecimalToPercent(aprDecimal) || ZERO_PERCENT;
    if (!compoundOn) {
      return {
        apr,
        apy: apr,
      };
    }

    const ratePerPeriod = (principal + interest * compoundEvery) / principal;
    const compoundTimes = 365 / compoundEvery;
    const decimal = ratePerPeriod ** compoundTimes - 1;
    const apy = formatDecimalToPercent(decimal) || ZERO_PERCENT;
    return {
      apr,
      apy,
    };
  }, [interest, principal, compoundEvery, compoundOn]);
}
