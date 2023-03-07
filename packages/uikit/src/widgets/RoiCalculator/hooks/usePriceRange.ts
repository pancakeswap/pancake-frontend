import { Currency, Price } from "@pancakeswap/sdk";
import { FeeAmount, nearestUsableTick, TickMath, TICK_SPACINGS, tickToPrice } from "@pancakeswap/v3-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Bound } from "../../../components/LiquidityChartRangeInput/types";
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
  const tickSpaceLimits: {
    [bound in Bound]: number | undefined;
  } = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount ? nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]) : undefined,
      [Bound.UPPER]: feeAmount ? nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]) : undefined,
    }),
    [feeAmount]
  );

  const priceLimits: {
    [bound in Bound]: Price<Currency, Currency> | undefined;
  } = useMemo(() => {
    const token0 = invertPrice ? quoteCurrency?.wrapped : baseCurrency?.wrapped;
    const token1 = invertPrice ? baseCurrency?.wrapped : quoteCurrency?.wrapped;
    return {
      [Bound.LOWER]:
        token0 && token1 && tickSpaceLimits[Bound.LOWER]
          ? tickToPrice(token0, token1, tickSpaceLimits[Bound.LOWER])
          : undefined,
      [Bound.UPPER]:
        token0 && token1 && tickSpaceLimits[Bound.UPPER]
          ? tickToPrice(token0, token1, tickSpaceLimits[Bound.UPPER])
          : undefined,
    };
  }, [tickSpaceLimits, invertPrice, quoteCurrency, baseCurrency]);

  const rightRangeTypedValue = useMemo(() => {
    try {
      return invertPrice ? priceLower?.toFixed(6) : priceUpper?.toFixed(6);
    } catch (e) {
      return "0";
    }
  }, [priceLower, priceUpper, invertPrice]);

  const leftRangeTypedValue = useMemo(() => {
    try {
      return invertPrice ? priceUpper?.toFixed(6) : priceLower?.toFixed(6);
    } catch (e) {
      return "0";
    }
  }, [priceLower, priceUpper, invertPrice]);

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

  const saveSetPriceUpper = useCallback(
    (price?: Price<Currency, Currency>) => {
      if (!price || !priceLimits.UPPER) {
        return;
      }
      const priceToSet = price.greaterThan(priceLimits.UPPER) ? priceLimits.UPPER : price;
      setPriceUpper(priceToSet);
    },
    [priceLimits]
  );

  const saveSetPriceLower = useCallback(
    (price?: Price<Currency, Currency>) => {
      if (!price || !priceLimits.LOWER) {
        return;
      }
      const priceToSet = price.lessThan(priceLimits.LOWER) ? priceLimits.LOWER : price;
      setPriceLower(priceToSet);
    },
    [priceLimits]
  );

  const onLeftRangeInput = useCallback(
    (leftRangeValue: string) => {
      const price = tryParsePrice(baseCurrency?.wrapped, quoteCurrency?.wrapped, leftRangeValue);
      if (!invertPrice) {
        return saveSetPriceLower(price);
      }
      return saveSetPriceUpper(price?.invert());
    },
    [baseCurrency, quoteCurrency, invertPrice, saveSetPriceUpper, saveSetPriceLower]
  );

  const onRightRangeInput = useCallback(
    (rightRangeValue: string) => {
      const price = tryParsePrice(baseCurrency?.wrapped, quoteCurrency?.wrapped, rightRangeValue);
      if (!invertPrice) {
        return saveSetPriceUpper(price);
      }
      return saveSetPriceLower(price?.invert());
    },
    [baseCurrency, quoteCurrency, invertPrice, saveSetPriceUpper, saveSetPriceLower]
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
