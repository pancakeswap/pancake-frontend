import { Protocol } from '@pancakeswap/farms'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { Address, isAddressEqual } from 'viem'
import { PoolInfo } from '../../type'
import { getAccountV2LpDetails, getStablePairDetails } from '../fetcher'
import { getAccountV3Positions } from '../fetcher/v3'
import { PositionDetail, StableLPDetail, V2LPDetail } from '../type'
import { useLatestTxReceipt } from './useLatestTxReceipt'

type PoolPositionDetail = {
  [Protocol.STABLE]: StableLPDetail
  [Protocol.V2]: V2LPDetail
  [Protocol.V3]: PositionDetail[]
}

export const useAccountPositionDetailByPool = <TProtocol extends keyof PoolPositionDetail>(
  chainId: number,
  account?: Address | null,
  poolInfo?: PoolInfo,
): UseQueryResult<PoolPositionDetail[TProtocol]> => {
  const [currency0, currency1] = useMemo(() => {
    if (!poolInfo) return [undefined, undefined]
    const { token0, token1 } = poolInfo
    return [token0.wrapped, token1.wrapped]
  }, [poolInfo])
  const protocol = useMemo(() => poolInfo?.protocol, [poolInfo])
  const queryFn = useCallback(async () => {
    if (protocol === 'v2') {
      return getAccountV2LpDetails(
        chainId,
        account!,
        currency0 && currency1 ? [[currency0.wrapped, currency1.wrapped]] : [],
      )
    }
    if (protocol === 'stable') {
      const stablePair = LegacyRouter.stableSwapPairsByChainId[chainId].find((pair) => {
        return isAddressEqual(pair.stableSwapAddress, poolInfo?.stableSwapAddress as Address)
      })
      return getStablePairDetails(chainId, account!, stablePair ? [stablePair] : [])
    }
    if (protocol === 'v3') {
      return getAccountV3Positions(chainId, account!)
    }
    return Promise.resolve([])
  }, [account, chainId, currency0, currency1, poolInfo, protocol])
  const select = useCallback(
    (data) => {
      if (protocol === 'v3') {
        // v3
        const d = data.filter((position) => {
          const { token0, token1, fee } = position as PositionDetail
          return (
            poolInfo?.token0.wrapped.address &&
            isAddressEqual(token0, poolInfo?.token0.wrapped.address as Address) &&
            poolInfo?.token1.address &&
            isAddressEqual(token1, poolInfo?.token1.wrapped.address as Address) &&
            fee === poolInfo?.feeTier
          )
        })
        return d as PositionDetail[]
      }

      return data?.[0] && (data[0].nativeBalance.greaterThan('0') || data[0].farmingBalance.greaterThan('0'))
        ? data[0]
        : undefined
    },
    [poolInfo, protocol],
  )
  const [latestTxReceipt] = useLatestTxReceipt()
  return useQuery({
    queryKey: ['accountPosition', account, chainId, poolInfo?.lpAddress, latestTxReceipt?.blockHash],
    queryFn,
    enabled: !!account && !!poolInfo?.lpAddress,
    select,
  })
}
