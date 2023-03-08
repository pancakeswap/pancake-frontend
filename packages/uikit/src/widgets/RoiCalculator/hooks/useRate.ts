import { ZERO_PERCENT, Percent } from "@pancakeswap/sdk";
import { useMemo } from "react";

interface Params extends AprParams {
  // Num of days staked
  stakeFor?: number;
}

const scale = 1_000_000_000_000_000;

const formatDecimalToPercent = (decimal: number) => {
  return new Percent(Math.floor(decimal * scale), scale);
};

// @see https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
export function useRate({ stakeFor = 1, ...rest }: Params) {
  const apr = useApr(rest);
  const { principal } = rest;
  const accrued = useMemo(() => {
    if (!principal) {
      return 0;
    }

    return principal * (1 + parseFloat(apr.asFraction.toSignificant(6))) ** (stakeFor / 365);
  }, [apr, principal, stakeFor]);

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
  };
}

interface AprParams {
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
      return ZERO_PERCENT;
    }

    if (!compoundOn) {
      const decimal = (principal + interest * 365) / principal - 1;
      return formatDecimalToPercent(decimal);
    }

    const ratePerPeriod = (principal + interest * compoundEvery) / principal;
    const compoundTimes = 365 / compoundEvery;
    const decimal = ratePerPeriod ** compoundTimes - 1;
    return formatDecimalToPercent(decimal);
  }, [interest, principal, compoundEvery, compoundOn]);
}
