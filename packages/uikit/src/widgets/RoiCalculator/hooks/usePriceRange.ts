import { Currency, Price } from "@pancakeswap/sdk";
import {
  FeeAmount,
  // nearestUsableTick,
  // TickMath,
  // TICK_SPACINGS
} from "@pancakeswap/v3-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";

// import { Bound } from "../../../components/LiquidityChartRangeInput/types";
import { tryParsePrice, tryParseTick } from "../utils";

interface Params {
  feeAmount?: FeeAmount;
  baseCurrency?: Currency;
  quoteCurrency?: Currency;
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
}

interface PriceRangeInfo {
  tickLower?: number;
  tickUpper?: number;
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  onLeftRangeInput: (leftRangeValue: string) => void;
  onRightRangeInput: (rightRangeValue: string) => void;
}

export function usePriceRange({
  baseCurrency,
  quoteCurrency,
  feeAmount,
  priceLower: initialPriceLower,
  priceUpper: initialPriceUpper,
}: Params): PriceRangeInfo | null {
  const [priceLower, setPriceLower] = useState<Price<Currency, Currency> | undefined>(initialPriceLower);
  const [priceUpper, setPriceUpper] = useState<Price<Currency, Currency> | undefined>(initialPriceUpper);

  const invertPrice = Boolean(baseCurrency && quoteCurrency && quoteCurrency.wrapped.sortsBefore(baseCurrency.wrapped));

  // lower and upper limits in the tick space for `feeAmoun<Trans>
  // const tickSpaceLimits: {
  //   [bound in Bound]: number | undefined;
  // } = useMemo(
  //   () => ({
  //     [Bound.LOWER]: feeAmount ? nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]) : undefined,
  //     [Bound.UPPER]: feeAmount ? nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]) : undefined,
  //   }),
  //   [feeAmount]
  // );

  const rightRangeTypedValue = useMemo(
    () => (invertPrice ? priceLower?.toFixed(6) : priceUpper?.toFixed(6)),
    [priceLower, priceUpper, invertPrice]
  );

  const leftRangeTypedValue = useMemo(
    () => (invertPrice ? priceUpper?.toFixed(6) : priceLower?.toFixed(6)),
    [priceLower, priceUpper, invertPrice]
  );

  // parse typed range values and determine closest ticks
  // lower should always be a smaller tick
  const tickLower = useMemo(
    () =>
      invertPrice
        ? tryParseTick(quoteCurrency?.wrapped, baseCurrency?.wrapped, feeAmount, rightRangeTypedValue)
        : tryParseTick(baseCurrency?.wrapped, quoteCurrency?.wrapped, feeAmount, leftRangeTypedValue),
    [leftRangeTypedValue, rightRangeTypedValue, invertPrice, baseCurrency, quoteCurrency, feeAmount]
  );

  const tickUpper = useMemo(
    () =>
      invertPrice
        ? tryParseTick(quoteCurrency?.wrapped, baseCurrency?.wrapped, feeAmount, leftRangeTypedValue)
        : tryParseTick(baseCurrency?.wrapped, quoteCurrency?.wrapped, feeAmount, rightRangeTypedValue),
    [leftRangeTypedValue, rightRangeTypedValue, invertPrice, baseCurrency, quoteCurrency, feeAmount]
  );

  const onLeftRangeInput = useCallback(
    (leftRangeValue: string) => {
      const price = tryParsePrice(baseCurrency?.wrapped, quoteCurrency?.wrapped, leftRangeValue);
      const token0Price = invertPrice ? price?.invert() : price;
      if (!invertPrice) {
        return setPriceLower(token0Price);
      }
      return setPriceUpper(token0Price);
    },
    [invertPrice, baseCurrency, quoteCurrency]
  );

  const onRightRangeInput = useCallback(
    (rightRangeValue: string) => {
      const price = tryParsePrice(baseCurrency?.wrapped, quoteCurrency?.wrapped, rightRangeValue);
      const token0Price = invertPrice ? price?.invert() : price;
      if (!invertPrice) {
        return setPriceUpper(token0Price);
      }
      return setPriceLower(token0Price);
    },
    [invertPrice, baseCurrency, quoteCurrency]
  );

  useEffect(() => setPriceLower(initialPriceLower), [initialPriceLower]);

  useEffect(() => setPriceUpper(initialPriceUpper), [initialPriceUpper]);

  return {
    tickUpper,
    tickLower,
    priceLower,
    priceUpper,
    onRightRangeInput,
    onLeftRangeInput,
  };
}
