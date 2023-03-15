import { Price, Token, JSBI, Currency, Percent, Fraction } from "@pancakeswap/sdk";
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

export function tryParsePrice(baseToken?: Token, quoteToken?: Token, value?: string) {
  if (!baseToken || !quoteToken || !value) {
    return undefined;
  }

  if (!value.match(/^\d*\.?\d+$/)) {
    return undefined;
  }

  const [whole, fraction] = value.split(".");

  const decimals = fraction?.length ?? 0;
  const withoutDecimals = JSBI.BigInt((whole ?? "") + (fraction ?? ""));

  return new Price(
    baseToken,
    quoteToken,
    JSBI.multiply(JSBI.BigInt(10 ** decimals), JSBI.BigInt(10 ** baseToken.decimals)),
    JSBI.multiply(withoutDecimals, JSBI.BigInt(10 ** quoteToken.decimals))
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

  if (JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) {
    tick = TickMath.MAX_TICK;
  } else if (JSBI.lessThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO)) {
    tick = TickMath.MIN_TICK;
  } else {
    // this function is agnostic to the base, will always return the correct tick
    tick = priceToClosestTick(price);
  }

  return nearestUsableTick(tick, TICK_SPACINGS[feeAmount]);
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
  const scaler = 1_000_000_000;
  if (!currencyA || !currencyB || typeof currencyAUsdPrice !== "number" || typeof currencyBUsdPrice !== "number") {
    return undefined;
  }
  const isToken0 = currencyA.wrapped.sortsBefore(currencyB.wrapped);
  const amountA = tryParseAmount(String(scaler / currencyAUsdPrice), currencyA);
  const amountB = tryParseAmount(String(scaler / currencyBUsdPrice), currencyB);
  const [baseAmount, quoteAmount] = isToken0
    ? [amountA?.wrapped, amountB?.wrapped]
    : [amountB?.wrapped, amountA?.wrapped];
  if (!baseAmount || !quoteAmount) {
    return undefined;
  }
  return new Price({ baseAmount, quoteAmount });
}

export function toPercent(numerator: number, denominator: number) {
  const scaler = 1_000_000_000_000;
  return new Percent(JSBI.BigInt(Math.floor((numerator / denominator) * scaler)), JSBI.BigInt(scaler));
}

export function toFraction(numerator: number, denominator: number) {
  const scaler = 1_000_000_000_000;
  return new Fraction(JSBI.BigInt(Math.floor((numerator / denominator) * scaler)), JSBI.BigInt(scaler));
}
