import { Currency, CurrencyAmount, Fraction, JSBI, ONE, Percent, ZERO } from "@pancakeswap/sdk";
import { FeeAmount, Tick, FeeCalculator } from "@pancakeswap/v3-sdk";
import { useMemo } from "react";

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
