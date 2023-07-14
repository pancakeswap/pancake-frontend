import { Currency } from '@pancakeswap/sdk'
import { tickToPrice } from '@pancakeswap/v3-sdk'
import { useCallback, useMemo, useState } from 'react'

interface PositionInfo {
  baseCurrency?: Currency
  quoteCurrency?: Currency
  tickLower?: number
  tickUpper?: number
  tickCurrent?: number
}

export function usePositionPrices({
  baseCurrency: initialBaseCurrency,
  quoteCurrency: initialQuoteCurrency,
  tickLower,
  tickUpper,
  tickCurrent,
}: PositionInfo) {
  const [invert, setInvert] = useState(false)
  const toggleInvert = useCallback(() => setInvert(!invert), [invert])
  const baseCurrency = useMemo(
    () => (invert ? initialQuoteCurrency : initialBaseCurrency),
    [invert, initialBaseCurrency, initialQuoteCurrency],
  )
  const quoteCurrency = useMemo(
    () => (invert ? initialBaseCurrency : initialQuoteCurrency),
    [invert, initialBaseCurrency, initialQuoteCurrency],
  )

  const sorted = useMemo(
    () =>
      Boolean(
        baseCurrency?.wrapped &&
          quoteCurrency?.wrapped &&
          !baseCurrency.wrapped.equals(quoteCurrency.wrapped) &&
          baseCurrency.wrapped.sortsBefore(quoteCurrency.wrapped),
      ),
    [baseCurrency, quoteCurrency],
  )

  const tickLowerPrice = useMemo(
    () =>
      baseCurrency?.wrapped &&
      quoteCurrency?.wrapped &&
      typeof tickLower === 'number' &&
      tickToPrice(baseCurrency.wrapped, quoteCurrency.wrapped, tickLower),
    [tickLower, baseCurrency, quoteCurrency],
  )
  const tickUpperPrice = useMemo(
    () =>
      baseCurrency?.wrapped &&
      quoteCurrency?.wrapped &&
      typeof tickUpper === 'number' &&
      tickToPrice(baseCurrency.wrapped, quoteCurrency.wrapped, tickUpper),
    [tickUpper, baseCurrency, quoteCurrency],
  )
  const [priceLower, priceUpper] = useMemo(
    () => (sorted ? [tickLowerPrice, tickUpperPrice] : [tickUpperPrice, tickLowerPrice]),
    [sorted, tickLowerPrice, tickUpperPrice],
  )
  const priceCurrent = useMemo(
    () =>
      baseCurrency?.wrapped &&
      quoteCurrency?.wrapped &&
      typeof tickCurrent === 'number' &&
      tickToPrice(baseCurrency.wrapped, quoteCurrency.wrapped, tickCurrent),
    [tickCurrent, baseCurrency, quoteCurrency],
  )

  return {
    baseCurrency,
    quoteCurrency,
    priceLower,
    priceUpper,
    priceCurrent,
    invert: toggleInvert,
    inverted: invert,
  }
}
