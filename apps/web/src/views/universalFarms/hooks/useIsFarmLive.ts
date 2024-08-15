import { Protocol, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { useMemo } from 'react'

export const useIsFarmLive = ({
  currency0,
  currency1,
  chainId,
  protocol,
  fee,
}: {
  currency0: Currency
  currency1: Currency
  chainId: number
  protocol: Protocol
  fee?: number
}) => {
  return useMemo(() => {
    const [token0, token1] = currency0.wrapped.sortsBefore(currency1.wrapped)
      ? [currency0.wrapped, currency1.wrapped]
      : [currency1.wrapped, currency0.wrapped]
    return UNIVERSAL_FARMS.some((farm) => {
      const [farmToken0, farmToken1] = farm.token0.sortsBefore(farm.token1)
        ? [farm.token0, farm.token1]
        : [farm.token1, farm.token0]
      return (
        farm.chainId === chainId &&
        farm.protocol === protocol &&
        token0.equals(farmToken0) &&
        token1.equals(farmToken1) &&
        (!('feeAmount' in farm && fee) || farm.feeAmount === fee)
      )
    })
  }, [chainId, currency0, currency1, fee, protocol])
}
