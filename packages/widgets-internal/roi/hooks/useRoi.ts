import { Currency, CurrencyAmount, Fraction, ONE, Percent, ZERO } from "@pancakeswap/sdk";
import { formatFraction, parseNumberToFraction } from "@pancakeswap/utils/formatFractions";
import { FeeAmount, FeeCalculator } from "@pancakeswap/v3-sdk";
import { useMemo } from "react";

import { useRate } from "./useRate";

interface Params extends Omit<FeeParams, "amount" | "currency"> {
  stakeFor?: number; // num of days
  compoundEvery?: number;
  compoundOn?: boolean;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
  amountA?: CurrencyAmount<Currency>;
  amountB?: CurrencyAmount<Currency>;
  cakeApr?: number;
  editCakeApr?: number;
  cakePrice?: number;
}

export function useRoi({
  amountA,
  amountB,
  compoundEvery,
  currencyAUsdPrice,
  currencyBUsdPrice,
  stakeFor = 365,
  compoundOn,
  cakeApr,
  editCakeApr,
  ...rest
}: Params) {
  const fee24h = useFee24h({
    ...rest,
    amountA,
    amountB,
  });
  const principal = useMemo(
    () =>
      amountA &&
      amountB &&
      currencyAUsdPrice &&
      currencyBUsdPrice &&
      parseFloat(amountA.toExact()) * currencyAUsdPrice + parseFloat(amountB.toExact()) * currencyBUsdPrice,
    [amountA, amountB, currencyAUsdPrice, currencyBUsdPrice]
  );
  const { rate, apr, reward, apy } = useRate({
    interest: parseFloat(formatFraction(fee24h, 6) || "0"),
    principal,
    compoundEvery,
    compoundOn,
    stakeFor,
  });
  const fee = useMemo(() => parseNumberToFraction(reward, 18), [reward]);

  const {
    apr: cakeAprInPercent,
    apy: cakeApy,
    reward: originalCakeReward,
  } = useRate({
    interest: (cakeApr && principal && ((cakeApr / 100) * principal) / 365) ?? 0,
    principal,
    compoundEvery,
    compoundOn,
    stakeFor,
  });

  const {
    rate: cakeRate,
    reward: cakeReward,
    apr: editCakeAprInPercent,
    apy: editCakeApy,
  } = useRate({
    interest: (editCakeApr && principal && ((editCakeApr / 100) * principal) / 365) ?? 0,
    principal,
    compoundEvery,
    compoundOn,
    stakeFor,
  });

  const {
    apy: combinedApy,
    rate: combinedRate,
    reward: combinedReward,
  } = useRate({
    interest: parseFloat(formatFraction(fee24h, 6) || "0"),
    principal,
    compoundEvery,
    compoundOn,
    stakeFor,
    cakeInterest: (cakeApr && principal && ((cakeApr / 100) * principal) / 365) ?? 0,
  });

  return {
    fee,
    rate,
    apr,
    apy,
    cakeApr: cakeAprInPercent,
    editCakeApr: editCakeAprInPercent,
    cakeApy,
    editCakeApy,
    cakeRate,
    cakeReward,
    originalCakeReward,
    combinedApy,
    combinedRate,
    combinedReward,
  };
}

export interface FeeParams {
  // Amount of token user input
  amountA?: CurrencyAmount<Currency>;
  // Currency of the other token in the pool
  amountB?: CurrencyAmount<Currency>;
  tickLower?: number;
  tickUpper?: number;
  // Average 24h historical trading volume in USD
  volume24H?: number;

  // The reason of using price sqrt X96 instead of tick current is that
  // tick current may have rounding error since it's a floor rounding
  sqrtRatioX96?: bigint;
  // All ticks inside the pool
  mostActiveLiquidity?: bigint;
  // Fee tier of the pool, in hundreds of a bip, i.e. 1e-6
  fee?: FeeAmount;

  // Proportion of protocol fee
  protocolFee?: Percent;
}

const ZERO_FEE = new Fraction(ZERO, ONE);

export function useFee24h({
  amountA,
  amountB,
  tickLower,
  tickUpper,
  volume24H,
  sqrtRatioX96,
  mostActiveLiquidity,
  fee,
  protocolFee,
}: FeeParams) {
  return useMemo(() => {
    if (
      !amountA ||
      !amountB ||
      typeof tickLower !== "number" ||
      typeof tickUpper !== "number" ||
      !volume24H ||
      !sqrtRatioX96 ||
      !mostActiveLiquidity ||
      !fee
    ) {
      return ZERO_FEE;
    }
    const fee24h = FeeCalculator.getEstimatedLPFeeByAmounts({
      amountA,
      amountB,
      tickLower,
      tickUpper,
      volume24H,
      sqrtRatioX96,
      mostActiveLiquidity,
      fee,
      protocolFee,
    });
    return fee24h || ZERO_FEE;
  }, [amountA, amountB, tickLower, tickUpper, volume24H, sqrtRatioX96, mostActiveLiquidity, fee, protocolFee]);
}
