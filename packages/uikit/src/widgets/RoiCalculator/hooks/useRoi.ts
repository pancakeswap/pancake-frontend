import { Currency, CurrencyAmount, Fraction, JSBI, ONE, Percent, ZERO, Price } from "@pancakeswap/sdk";
import { FeeAmount, Tick, FeeCalculator } from "@pancakeswap/v3-sdk";
import { useMemo } from "react";

import { useRate } from "./useRate";

interface Params extends FeeParams {
  stakeFor?: number; // num of days
  compoundEvery?: number;
  compoundOn?: boolean;
  amountUsdPrice?: Price<Currency, Currency>;
}

export function useRoi({ compoundEvery, amountUsdPrice, stakeFor = 365, compoundOn, ...rest }: Params) {
  const { amount } = rest;
  const fee24h = useFee24h(rest);
  const fee = useMemo(() => fee24h.multiply(JSBI.BigInt(stakeFor)), [fee24h, stakeFor]);
  const principalUsdAmount = amount && amountUsdPrice?.quote(amount);
  const { rate, apr } = useRate({
    interest: parseFloat(fee24h.toSignificant(6)),
    principal: parseFloat(principalUsdAmount?.toExact() || "0"),
    compoundEvery,
    compoundOn,
    stakeFor,
  });

  return {
    fee,
    rate,
    apr,
  };
}

interface FeeParams {
  // Amount of token user input
  amount?: CurrencyAmount<Currency>;
  // Currency of the other token in the pool
  currency?: Currency;
  tickLower?: number;
  tickUpper?: number;
  // Average 24h historical trading volume in USD
  volume24H?: number;

  // The reason of using price sqrt X96 instead of tick current is that
  // tick current may have rounding error since it's a floor rounding
  sqrtRatioX96?: JSBI;
  // All ticks inside the pool
  ticks?: Tick[];
  // Fee tier of the pool, in hundreds of a bip, i.e. 1e-6
  fee?: FeeAmount;

  // Proportion of protocol fee
  protocolFee?: Percent;
}

export function useFee24h({
  amount,
  currency,
  tickLower,
  tickUpper,
  volume24H,
  sqrtRatioX96,
  ticks,
  fee,
  protocolFee,
}: FeeParams) {
  return useMemo(() => {
    if (
      !amount ||
      !currency ||
      typeof tickLower !== "number" ||
      typeof tickUpper !== "number" ||
      !volume24H ||
      !sqrtRatioX96 ||
      !ticks ||
      !fee
    ) {
      return new Fraction(ZERO, ONE);
    }
    return FeeCalculator.getEstimatedLPFee({
      amount,
      currency,
      tickLower,
      tickUpper,
      volume24H,
      sqrtRatioX96,
      ticks,
      fee,
      protocolFee,
    });
  }, [amount, currency, tickLower, tickUpper, volume24H, sqrtRatioX96, ticks, fee, protocolFee]);
}
