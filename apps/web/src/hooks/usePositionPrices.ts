import { Currency } from '@pancakeswap/sdk'
import { tickToPrice } from '@pancakeswap/v3-sdk'
import { useCallback, useMemo, useState } from 'react'

interface PositionInfo {
  currencyA?: Currency
  currencyB?: Currency
  tickLower?: number
  tickUpper?: number
  tickCurrent?: number
}

export function usePositionPrices({
  currencyA: initialBaseCurrency,
  currencyB: initialQuoteCurrency,
  tickLower,
  tickUpper,
  tickCurrent,
}: PositionInfo) {
  const [invert, setInvert] = useState(false)
  const toggleInvert = useCallback(() => setInvert(!invert), [invert])
  const currencyA = useMemo(
    () => (invert ? initialQuoteCurrency : initialBaseCurrency),
    [invert, initialBaseCurrency, initialQuoteCurrency],
  )
  const currencyB = useMemo(
    () => (invert ? initialBaseCurrency : initialQuoteCurrency),
    [invert, initialBaseCurrency, initialQuoteCurrency],
  )

  const sorted = useMemo(
    () =>
      Boolean(
        currencyA?.wrapped &&
          currencyB?.wrapped &&
          !currencyA.wrapped.equals(currencyB.wrapped) &&
          currencyA.wrapped.sortsBefore(currencyB.wrapped),
      ),
    [currencyA, currencyB],
  )

  const tickLowerPrice = useMemo(
    () =>
      currencyA?.wrapped &&
      currencyB?.wrapped &&
      typeof tickLower === 'number' &&
      tickToPrice(currencyA.wrapped, currencyB.wrapped, tickLower),
    [tickLower, currencyA, currencyB],
  )
  const tickUpperPrice = useMemo(
    () =>
      currencyA?.wrapped &&
      currencyB?.wrapped &&
      typeof tickUpper === 'number' &&
      tickToPrice(currencyA.wrapped, currencyB.wrapped, tickUpper),
    [tickUpper, currencyA, currencyB],
  )
  const [priceLower, priceUpper] = useMemo(
    () => (sorted ? [tickLowerPrice, tickUpperPrice] : [tickUpperPrice, tickLowerPrice]),
    [sorted, tickLowerPrice, tickUpperPrice],
  )
  const priceCurrent = useMemo(
    () =>
      currencyA?.wrapped &&
      currencyB?.wrapped &&
      typeof tickCurrent === 'number' &&
      tickToPrice(currencyA.wrapped, currencyB.wrapped, tickCurrent),
    [tickCurrent, currencyA, currencyB],
  )

  return {
    currencyA,
    currencyB,
    priceLower,
    priceUpper,
    priceCurrent,
    invert: toggleInvert,
    inverted: invert,
  }
}
