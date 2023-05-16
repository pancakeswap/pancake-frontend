import { Currency, CurrencyAmount } from "@pancakeswap/sdk";
import tryParseAmount from "@pancakeswap/utils/tryParseAmount";

interface Params {
  usdValue?: string;
  currencyA?: Currency;
  currencyB?: Currency;
  price?: number | string;
  priceLower?: number | string;
  priceUpper?: number | string;
  sqrtRatioX96?: bigint;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
}

export function getTokenAmountsFromDepositUsd({
  usdValue,
  currencyA,
  currencyB,
  price,
  priceLower,
  priceUpper,
  sqrtRatioX96,
  currencyAUsdPrice,
  currencyBUsdPrice,
}: Params) {
  if (
    !usdValue ||
    !currencyA ||
    !currencyB ||
    !currencyAUsdPrice ||
    !currencyBUsdPrice ||
    !sqrtRatioX96 ||
    priceUpper === undefined ||
    priceLower === undefined ||
    price === undefined
  ) {
    return [];
  }

  const usdAmount = parseFloat(usdValue);
  const isToken0 = currencyA.wrapped.sortsBefore(currencyB.wrapped);
  const token0 = isToken0 ? currencyA : currencyB;
  const token1 = isToken0 ? currencyB : currencyA;
  const p = parseFloat(String(price));
  const pl = parseFloat(String(priceLower));
  const pu = parseFloat(String(priceUpper));
  const priceUSDX = isToken0 ? currencyAUsdPrice : currencyBUsdPrice;
  const priceUSDY = isToken0 ? currencyBUsdPrice : currencyAUsdPrice;
  const deltaL =
    usdAmount / ((Math.sqrt(p) - Math.sqrt(pl)) * priceUSDY + (1 / Math.sqrt(p) - 1 / Math.sqrt(pu)) * priceUSDX);

  let deltaY = deltaL * (Math.sqrt(p) - Math.sqrt(pl));
  if (deltaY * priceUSDY < 0) deltaY = 0;
  if (deltaY * priceUSDY > usdAmount) deltaY = usdAmount / priceUSDY;

  let deltaX = deltaL * (1 / Math.sqrt(p) - 1 / Math.sqrt(pu));
  if (deltaX * priceUSDX < 0) deltaX = 0;
  if (deltaX * priceUSDX > usdAmount) deltaX = usdAmount / priceUSDX;

  const amount0 = deltaX.toFixed(token0.decimals);
  const amount1 = deltaY.toFixed(token1.decimals);
  const amountARaw = isToken0 ? amount0 : amount1;
  const amountBRaw = isToken0 ? amount1 : amount0;
  const amountA = tryParseAmount(amountARaw, currencyA) || CurrencyAmount.fromRawAmount(currencyA, "0");
  const amountB = tryParseAmount(amountBRaw, currencyB) || CurrencyAmount.fromRawAmount(currencyB, "0");
  return [amountA, amountB];
}
