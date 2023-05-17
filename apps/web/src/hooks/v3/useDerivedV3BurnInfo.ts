import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { Position } from '@pancakeswap/v3-sdk'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useToken } from 'hooks/Tokens'
import { ReactNode, useMemo } from 'react'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { PositionDetails } from '@pancakeswap/farms'
import { usePool } from './usePools'
import { useV3PositionFees } from './useV3PositionFees'

export function useDerivedV3BurnInfo(
  position?: PositionDetails,
  percent?: number,
  asWETH = false,
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
  const { account } = useWeb3React()

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

  const liquidityPercentage = new Percent(percent, 100)

  const discountedAmount0 = positionSDK
    ? liquidityPercentage.multiply(positionSDK.amount0.quotient).quotient
    : undefined
  const discountedAmount1 = positionSDK
    ? liquidityPercentage.multiply(positionSDK.amount1.quotient).quotient
    : undefined

  const liquidityValue0 =
    token0 && typeof discountedAmount0 !== 'undefined'
      ? CurrencyAmount.fromRawAmount(asWETH ? token0 : unwrappedToken(token0), discountedAmount0)
      : undefined
  const liquidityValue1 =
    token1 && typeof discountedAmount1 !== 'undefined'
      ? CurrencyAmount.fromRawAmount(asWETH ? token1 : unwrappedToken(token1), discountedAmount1)
      : undefined

  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, position?.tokenId, asWETH)

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
