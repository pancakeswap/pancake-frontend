import { Position } from '@pancakeswap/v3-sdk'
import { useToken } from 'hooks/Tokens'
import { useMemo } from 'react'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { usePool } from 'hooks/v3/usePools'
import { PositionDetails } from 'hooks/v3/types'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { Currency, Price, Token } from '@pancakeswap/sdk'

interface PositionListItemDisplayProps {
  positionSummaryLink: string
  currencyBase: Currency
  currencyQuote: Currency
  removed: boolean
  outOfRange: boolean
  priceUpper: Price<Token, Token>
  tickAtLimit: {
    LOWER: boolean
    UPPER: boolean
  }
  priceLower: Price<Token, Token>
  feeAmount: number
}

interface PositionListItemProps {
  positionDetails: PositionDetails
  children: (displayProps: PositionListItemDisplayProps) => JSX.Element
}

export default function PositionListItem({ positionDetails, children }: PositionListItemProps) {
  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
  } = positionDetails

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // construct Position from details returned
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const position = useMemo(() => {
    if (pool) {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  // prices
  const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  // check if price is within range
  const outOfRange: boolean = pool ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper : false

  const positionSummaryLink = `/pool-v3/${positionDetails.tokenId}`

  const removed = liquidity?.eq(0)

  return children({
    positionSummaryLink,
    currencyBase,
    currencyQuote,
    removed,
    outOfRange,
    priceUpper,
    tickAtLimit,
    priceLower,
    feeAmount,
  })
}
