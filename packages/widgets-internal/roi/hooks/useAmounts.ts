import { Currency, CurrencyAmount, Price } from "@pancakeswap/sdk";
import tryParseAmount from "@pancakeswap/utils/tryParseAmount";
import { FeeCalculator, TickMath } from "@pancakeswap/v3-sdk";
import { useCallback, useMemo, useState, useEffect } from "react";
import { formatPrice, formatAmount } from "@pancakeswap/utils/formatFractions";

import { getTokenAmountsFromDepositUsd } from "../utils";

interface Params {
  independentAmount?: CurrencyAmount<Currency>;
  currencyA?: Currency;
  currencyB?: Currency;
  tickLower?: number;
  tickUpper?: number;
  sqrtRatioX96?: bigint;
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
    value: formatAmount(initialIndependentAmount, 6) || "0",
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
        value: formatAmount(initialIndependentAmount, 6) || "0",
        currency: initialIndependentAmount.currency,
      });
    }
  }, [initialIndependentAmount]);

  const [amountA, amountB] = amounts;
  const { value, currency } = independentField;
  return {
    amountA,
    amountB,
    valueA: currencyA && currency?.equals(currencyA) ? value : formatAmount(amountA, 6) || "0",
    valueB: currencyB && currency?.equals(currencyB) ? value : formatAmount(amountB, 6) || "0",
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
  sqrtRatioX96?: bigint;
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
    return getTokenAmountsFromDepositUsd({
      usdValue,
      currencyA,
      currencyB,
      price: formatPrice(price, 6),
      priceLower: formatPrice(priceLower, 6),
      priceUpper: formatPrice(priceUpper, 6),
      sqrtRatioX96,
      currencyAUsdPrice,
      currencyBUsdPrice,
    });
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
    valueA: amountA ? formatAmount(amountA, 6) : "0",
    valueB: amountB ? formatAmount(amountB, 6) : "0",
  };
}

interface TokenAmountOptions {
  amount?: CurrencyAmount<Currency>;
  currencyA?: Currency;
  currencyB?: Currency;
  sqrtRatioX96?: bigint;
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

    if (!dependentAmount) {
      return [];
    }

    const amountA = isAIndependent ? amount : dependentAmount;
    const amountB = !isAIndependent ? amount : dependentAmount;
    return [amountA, amountB];
  }, [currencyA, currencyB, sqrtRatioX96, tickLower, tickUpper, amount]);
}
