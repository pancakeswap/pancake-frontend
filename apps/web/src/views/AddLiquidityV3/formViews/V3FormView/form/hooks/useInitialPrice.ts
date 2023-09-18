import { Price, Token } from '@pancakeswap/swap-sdk-core'
import { tryParsePrice } from 'hooks/v3/utils'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

export const useInitialPrice = (baseToken?: Token, quoteToken?: Token) => {
  const { query } = useRouter()
  const [{ initialPriceLower, initialPriceUpper }, setInitial] = useState<{
    initialPriceLower: Price<Token, Token> | undefined
    initialPriceUpper: Price<Token, Token> | undefined
  }>({
    initialPriceLower: undefined,
    initialPriceUpper: undefined,
  })
  const [minPrice, maxPrice] = useMemo(() => {
    const { minPrice: rawMinPrice, maxPrice: rawMaxPrice } = query

    return [rawMinPrice, rawMaxPrice].map((p) => {
      if (typeof p === 'string' && !Number.isNaN(p)) return p
      return undefined
    })
  }, [query])

  useEffect(() => {
    if (!initialPriceLower && !initialPriceUpper && minPrice && maxPrice) {
      setInitial({
        initialPriceLower: tryParsePrice(baseToken, quoteToken, minPrice),
        initialPriceUpper: tryParsePrice(baseToken, quoteToken, maxPrice),
      })
    }
  }, [query, initialPriceLower, initialPriceUpper, minPrice, maxPrice, baseToken, quoteToken])

  return {
    initialPriceLower,
    initialPriceUpper,
  }
}
