import { Currency, CurrencyAmount, JSBI } from "@pancakeswap/sdk";
import tryParseAmount from "@pancakeswap/utils/tryParseAmount";
import { FeeCalculator } from "@pancakeswap/v3-sdk";
import { useCallback, useMemo, useState, useEffect } from "react";

interface Params {
  independentAmount?: CurrencyAmount<Currency>;
  currencyA?: Currency;
  currencyB?: Currency;
  tickLower?: number;
  tickUpper?: number;
  sqrtRatioX96?: JSBI;
}

export function useAmounts({ independentAmount, currencyA, currencyB, tickLower, tickUpper, sqrtRatioX96 }: Params) {
  const [independentField, setIndependentField] = useState({
    value: independentAmount?.toSignificant(6) || "0",
    currency: independentAmount?.currency,
  });

  const amounts = useMemo(() => {
    const { value, currency } = independentField;
    if (
      !currency ||
      !currencyA ||
      !currencyB ||
      typeof tickLower !== "number" ||
      typeof tickUpper !== "number" ||
      !sqrtRatioX96
    ) {
      return [];
    }
    const amount: CurrencyAmount<Currency> | undefined = tryParseAmount(value, currency);
    if (!amount) {
      return [];
    }
    const amountA = currencyA.equals(currency)
      ? amount
      : FeeCalculator.getDependentAmount({
          amount,
          currency: currencyA,
          tickLower,
          tickUpper,
          sqrtRatioX96,
        });
    const amountB = currencyB.equals(currency)
      ? amount
      : FeeCalculator.getDependentAmount({
          amount,
          currency: currencyB,
          tickLower,
          tickUpper,
          sqrtRatioX96,
        });
    return [amountA, amountB];
  }, [currencyA, currencyB, sqrtRatioX96, tickLower, tickUpper, independentField]);

  const onChange = useCallback((value: string, currency?: Currency) => {
    if (currency) {
      setIndependentField({
        value,
        currency,
      });
    }
  }, []);

  useEffect(() => {
    if (independentAmount) {
      setIndependentField({
        value: independentAmount.toSignificant(6),
        currency: independentAmount.currency,
      });
    }
  }, [independentAmount]);

  const [amountA, amountB] = amounts;
  const { value, currency } = independentField;
  return {
    amountA,
    amountB,
    valueA: currencyA && currency?.equals(currencyA) ? value : amountA?.toSignificant(6) || "0",
    valueB: currencyB && currency?.equals(currencyB) ? value : amountB?.toSignificant(6) || "0",
    onChange,
  };
}
