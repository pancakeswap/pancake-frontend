import { PositionDetails } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { Position } from '@pancakeswap/v3-sdk'
import { useToken } from 'hooks/Tokens'
import { ReactNode, useMemo } from 'react'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { useAccount } from 'wagmi'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { usePool } from './usePools'
import { useV3PositionFees } from './useV3PositionFees'

export function useDerivedV3BurnInfo(
  position?: PositionDetails,
  percent?: number,
  asWNATIVE = false,
): {
  position?: Position
  liquidityPercentage?: Percent
  liquidityValue0?: CurrencyAmount<Currency>
  liquidityValue1?: CurrencyAmount<Currency>
  feeValue0?: CurrencyAmount<Currency>
  feeValue1?: CurrencyAmount<Currency>
  outOfRange: boolean
  error?: ReactNode
} {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const token0 = useToken(position?.token0)
  const token1 = useToken(position?.token1)

  const [, pool] = usePool(token0 ?? undefined, token1 ?? undefined, position?.fee)

  const positionSDK = useMemo(
    () =>
      pool &&
      typeof position?.liquidity === 'bigint' &&
      typeof position?.tickLower === 'number' &&
      typeof position?.tickUpper === 'number'
        ? new Position({
            pool,
            liquidity: position.liquidity.toString(),
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
          })
        : undefined,
    [pool, position],
  )

  const liquidityPercentage = !isUndefinedOrNull(percent) ? new Percent(percent!, 100) : undefined

  const discountedAmount0 = positionSDK
    ? liquidityPercentage?.multiply(positionSDK.amount0.quotient).quotient
    : undefined
  const discountedAmount1 = positionSDK
    ? liquidityPercentage?.multiply(positionSDK.amount1.quotient).quotient
    : undefined

  const unwrappedToken0 = token0 ? unwrappedToken(token0) : undefined
  const unwrappedToken1 = token1 ? unwrappedToken(token1) : undefined
  const liquidityValue0 =
    token0 && unwrappedToken0 && typeof discountedAmount0 !== 'undefined'
      ? CurrencyAmount.fromRawAmount(asWNATIVE ? token0 : unwrappedToken0, discountedAmount0)
      : undefined
  const liquidityValue1 =
    token1 && unwrappedToken1 && typeof discountedAmount1 !== 'undefined'
      ? CurrencyAmount.fromRawAmount(asWNATIVE ? token1 : unwrappedToken1, discountedAmount1)
      : undefined

  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, position?.tokenId, asWNATIVE)

  const outOfRange =
    pool && position ? pool.tickCurrent < position.tickLower || pool.tickCurrent >= position.tickUpper : false

  let error: ReactNode | undefined
  if (!account) {
    error = t('Connect Wallet')
  }
  if (percent === 0) {
    error = error ?? t('Enter a percent')
  }
  return {
    position: positionSDK,
    liquidityPercentage,
    liquidityValue0,
    liquidityValue1,
    feeValue0,
    feeValue1,
    outOfRange,
    error,
  }
}
