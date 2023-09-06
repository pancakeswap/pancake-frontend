import { Price, Token, Currency, Percent, Fraction } from "@pancakeswap/sdk";
import { parseUnits } from "viem";
import {
  encodeSqrtRatioX96,
  FeeAmount,
  nearestUsableTick,
  priceToClosestTick,
  TICK_SPACINGS,
  TickMath,
} from "@pancakeswap/v3-sdk";
import tryParseAmount from "@pancakeswap/utils/tryParseAmount";

export * from "./computeSurroundingTicks";
export * from "./getTokenAmountsFromDepositUsd";

export function tryParsePrice(baseToken?: Token, quoteToken?: Token, value?: string) {
  if (!baseToken || !quoteToken || !value) {
    return undefined;
  }

  if (!value.match(/^\d*\.?\d+$/)) {
    return undefined;
  }

  const [whole, fraction] = value.split(".");

  const decimals = fraction?.length ?? 0;
  const withoutDecimals = BigInt((whole ?? "") + (fraction ?? ""));

  return new Price(
    baseToken,
    quoteToken,
    BigInt(10 ** decimals) * BigInt(10 ** baseToken.decimals),
    withoutDecimals * BigInt(10 ** quoteToken.decimals)
  );
}

export function tryParseTick(
  baseToken?: Token,
  quoteToken?: Token,
  feeAmount?: FeeAmount,
  value?: string
): number | undefined {
  if (!baseToken || !quoteToken || !feeAmount || !value) {
    return undefined;
  }

  const price = tryParsePrice(baseToken, quoteToken, value);

  if (!price) {
    return undefined;
  }

  let tick: number;

  // check price is within min/max bounds, if outside return min/max
  const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator);

  if (sqrtRatioX96 >= TickMath.MAX_SQRT_RATIO) {
    tick = TickMath.MAX_TICK;
  } else if (sqrtRatioX96 <= TickMath.MIN_SQRT_RATIO) {
    tick = TickMath.MIN_TICK;
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = priceToClosestTick(price);
  }

  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount]);
}

export function floatToFraction(num: number, decimals = 18) {
  try {
    const numFixed = num.toFixed(decimals);
    const numToParse =
      parseFloat(numFixed) > 10 ** decimals ? BigInt(Math.floor(parseFloat(numFixed))).toString() : numFixed;
    const typedValueParsed = parseUnits(numToParse as `${number}`, decimals).toString();
    return new Fraction(typedValueParsed, 10n ** BigInt(decimals));
  } catch (e) {
    console.debug(`Failed to parse ${num} to fraction`, e);
  }
  return undefined;
}

export function floatToPercent(num: number, decimals = 18) {
  const fraction = floatToFraction(num, decimals);
  if (!fraction) {
    return undefined;
  }
  return new Percent(fraction.numerator, fraction.denominator);
}

export function toSignificant(decimal: number | string, significant = 6) {
  return parseFloat(parseFloat(String(decimal)).toPrecision(significant));
}

export function toToken0Price(
  currencyA?: Currency,
  currencyB?: Currency,
  currencyAUsdPrice?: number,
  currencyBUsdPrice?: number
): Price<Token, Token> | undefined {
  if (!currencyA || !currencyB || typeof currencyAUsdPrice !== "number" || typeof currencyBUsdPrice !== "number") {
    return undefined;
  }
  const isToken0 = currencyA.wrapped.sortsBefore(currencyB.wrapped);
  const amountA = tryParseAmount((1 / currencyAUsdPrice).toFixed(currencyA.decimals), currencyA);
  const amountB = tryParseAmount((1 / currencyBUsdPrice).toFixed(currencyB.decimals), currencyB);
  const [baseAmount, quoteAmount] = isToken0
    ? [amountA?.wrapped, amountB?.wrapped]
    : [amountB?.wrapped, amountA?.wrapped];
  if (!baseAmount || !quoteAmount) {
    return undefined;
  }
  return new Price({ baseAmount, quoteAmount });
}
