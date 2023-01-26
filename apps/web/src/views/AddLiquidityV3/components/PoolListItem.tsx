import { Percent } from '@pancakeswap/sdk'
import { Position } from '@pancakeswap/v3-sdk'

import { DoubleCurrencyLogo } from 'components/Logo'
import { useToken } from 'hooks/Tokens'
import { useMemo } from 'react'

import NextLink from 'next/link'

import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { RowBetween } from '@pancakeswap/uikit'
import { usePool } from 'hooks/v3/usePools'
import { PositionDetails } from 'hooks/v3/types'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import styled from 'styled-components'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { useTranslation } from '@pancakeswap/localization'
import { Bound } from '../form/actions'

const PrimaryPositionIdData = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > * {
    margin-right: 8px;
  }
`

interface PositionListItemProps {
  positionDetails: PositionDetails
}

export default function PositionListItem({ positionDetails }: PositionListItemProps) {
  const {
    currentLanguage: { locale },
  } = useTranslation()

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

  return (
    <NextLink href={positionSummaryLink}>
      <RowBetween>
        <PrimaryPositionIdData>
          <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={18} margin />
          <div>
            &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
          </div>
          &nbsp;
          {new Percent(feeAmount, 1_000_000).toSignificant()}%
        </PrimaryPositionIdData>
        {removed ? 'Removed' : outOfRange ? 'Out of range' : 'In range'}
      </RowBetween>
      {priceLower && priceUpper && (
        <>
          <div>
            Min: {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale)} {currencyQuote?.symbol} per
            {currencyBase?.symbol ?? ''}
          </div>
          <div>
            Max: {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale)} {currencyQuote?.symbol} per{' '}
            {currencyBase?.symbol}
          </div>
        </>
      )}
    </NextLink>
  )
}
