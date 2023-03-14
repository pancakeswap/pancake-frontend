import { Currency, CurrencyAmount, JSBI, Price } from "@pancakeswap/sdk";
import tryParseAmount from "@pancakeswap/utils/tryParseAmount";
import { FeeCalculator, TickMath } from "@pancakeswap/v3-sdk";
import { useCallback, useMemo, useState, useEffect } from "react";

interface Params {
  independentAmount?: CurrencyAmount<Currency>;
  currencyA?: Currency;
  currencyB?: Currency;
  tickLower?: number;
  tickUpper?: number;
  sqrtRatioX96?: JSBI;
}

export function useAmounts({
  independentAmount: initialIndependentAmount,
  currencyA,
  currencyB,
  tickLower,
  tickUpper,
  sqrtRatioX96,
}: Params) {
  const [independentField, setIndependentField] = useState({
    value: initialIndependentAmount?.toSignificant(6) || "0",
    currency: initialIndependentAmount?.currency,
  });

  const independentAmount = useMemo(() => {
    const { value, currency } = independentField;
    return tryParseAmount(value, currency);
  }, [independentField]);

  const amounts = useTokenAmounts({
    amount: independentAmount,
    currencyA,
    currencyB,
    tickLower,
    tickUpper,
    sqrtRatioX96,
  });

  const onChange = useCallback((value: string, currency?: Currency) => {
    if (currency) {
      setIndependentField({
        value,
        currency,
      });
    }
  }, []);

  useEffect(() => {
    if (initialIndependentAmount) {
      setIndependentField({
        value: initialIndependentAmount.toSignificant(6),
        currency: initialIndependentAmount.currency,
      });
    }
  }, [initialIndependentAmount]);

  const [amountA, amountB] = amounts;
  const { value, currency } = independentField;
  return {
    amountA,
    amountB,
    valueA: currencyA && currency?.equals(currencyA) ? value : amountA?.toSignificant(6) || "0",
    valueB: currencyB && currency?.equals(currencyB) ? value : amountB?.toSignificant(6) || "0",
    independentAmount: currencyA && currencyB && currency?.equals(currencyA) ? amountA : amountB,
    dependentCurrency: currencyA && currencyB && currency?.equals(currencyA) ? currencyB : currencyA,
    onChange,
  };
}

interface AmountsByUsdValueParams {
  usdValue?: string;
  currencyA?: Currency;
  currencyB?: Currency;
  price?: Price<Currency, Currency>;
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  sqrtRatioX96?: JSBI;
  currencyAUsdPrice?: number;
  currencyBUsdPrice?: number;
}

export function useAmountsByUsdValue({
  usdValue,
  currencyA,
  currencyB,
  price,
  priceLower,
  priceUpper,
  sqrtRatioX96,
  currencyAUsdPrice,
  currencyBUsdPrice,
}: AmountsByUsdValueParams) {
  const amounts = useMemo(() => {
    if (
      !usdValue ||
      !currencyA ||
      !currencyB ||
      !currencyAUsdPrice ||
      !currencyBUsdPrice ||
      !sqrtRatioX96 ||
      !priceUpper ||
      !priceLower ||
      !price
    ) {
      return [];
    }

    const usdAmount = parseFloat(usdValue);
    const isToken0 = currencyA.wrapped.sortsBefore(currencyB.wrapped);
    const token0 = isToken0 ? currencyA : currencyB;
    const token1 = isToken0 ? currencyB : currencyA;
    const p = parseFloat(price.toFixed(6));
    const pl = parseFloat(priceLower.toFixed(6));
    const pu = parseFloat(priceUpper.toFixed(6));
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
    const amountA = tryParseAmount(amountARaw, currencyA);
    const amountB = tryParseAmount(amountBRaw, currencyB);
    return [amountA, amountB];
  }, [
    usdValue,
    currencyA,
    currencyB,
    currencyAUsdPrice,
    sqrtRatioX96,
    currencyBUsdPrice,
    priceLower,
    priceUpper,
    price,
  ]);
  const [amountA, amountB] = amounts;

  return {
    amountA,
    amountB,
    valueA: amountA ? amountA?.toSignificant(6) : "0",
    valueB: amountB ? amountB?.toSignificant(6) : "0",
  };
}

interface TokenAmountOptions {
  amount?: CurrencyAmount<Currency>;
  currencyA?: Currency;
  currencyB?: Currency;
  sqrtRatioX96?: JSBI;
  tickLower?: number;
  tickUpper?: number;
}

function useTokenAmounts({ amount, currencyA, currencyB, sqrtRatioX96, tickLower, tickUpper }: TokenAmountOptions) {
  return useMemo(() => {
    if (
      !amount ||
      !currencyA ||
      !currencyB ||
      typeof tickLower !== "number" ||
      typeof tickUpper !== "number" ||
      !sqrtRatioX96
    ) {
      return [];
    }
    const tickCurrent = TickMath.getTickAtSqrtRatio(sqrtRatioX96);
    const tickInRange = tickCurrent > tickLower && tickCurrent < tickUpper;
    const isAIndependent = currencyA.equals(amount.currency);
    const dependentCurrency = isAIndependent ? currencyB : currencyA;
    const dependentAmount = tickInRange
      ? FeeCalculator.getDependentAmount({
          amount,
          currency: dependentCurrency,
          tickLower,
          tickUpper,
          sqrtRatioX96,
        })
      : CurrencyAmount.fromRawAmount(dependentCurrency, "0");
    const amountA = isAIndependent ? amount : dependentAmount;
    const amountB = !isAIndependent ? amount : dependentAmount;
    return [amountA, amountB];
  }, [currencyA, currencyB, sqrtRatioX96, tickLower, tickUpper, amount]);
}
