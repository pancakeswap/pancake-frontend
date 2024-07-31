import { PositionDetails } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, Price, Token } from '@pancakeswap/sdk'
import { Position } from '@pancakeswap/v3-sdk'
import { Bound } from 'config/constants/types'
import { useToken } from 'hooks/Tokens'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { usePool } from 'hooks/v3/usePools'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'
import { unwrappedToken } from 'utils/wrappedCurrency'

export interface PositionListItemDisplayProps {
  positionSummaryLink: string
  currencyBase?: Currency
  currencyQuote?: Currency
  removed: boolean
  outOfRange: boolean
  priceUpper?: Price<Token, Token>
  tickAtLimit: {
    LOWER?: boolean
    UPPER?: boolean
  }
  priceLower?: Price<Token, Token>
  feeAmount: number
  subtitle: string
  setInverted: Dispatch<SetStateAction<boolean>>
  position: Position | undefined
}

interface PositionListItemProps {
  positionDetails: PositionDetails
  children: (displayProps: PositionListItemDisplayProps) => ReactNode
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

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  const [inverted, setInverted] = useState(false)

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

  const positionSummaryLink = `/liquidity/${positionDetails.tokenId}`

  const removed = liquidity === 0n

  let subtitle = ''

  if (priceUpper && priceLower && currencyBase && currencyQuote) {
    subtitle = `${t('Min %minAmount%', {
      minAmount: formatTickPrice(inverted ? priceUpper.invert() : priceLower, tickAtLimit, Bound.LOWER, locale),
    })} / ${t('Max %maxAmount%', {
      maxAmount: formatTickPrice(inverted ? priceLower.invert() : priceUpper, tickAtLimit, Bound.UPPER, locale),
    })} ${t('%assetA% per %assetB%', {
      assetA: inverted ? currencyBase?.symbol : currencyQuote?.symbol,
      assetB: inverted ? currencyQuote?.symbol : currencyBase?.symbol,
    })}`
  }

  return children({
    position,
    positionSummaryLink,
    currencyBase,
    currencyQuote,
    removed,
    outOfRange,
    priceUpper,
    tickAtLimit,
    priceLower,
    feeAmount,
    subtitle,
    setInverted,
  })
}
