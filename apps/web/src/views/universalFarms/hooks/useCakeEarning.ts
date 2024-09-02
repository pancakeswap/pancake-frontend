import { Protocol } from '@pancakeswap/farms'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import { useStakedPositionsByUser } from 'state/farmsV3/hooks'
import { useAccountPositionDetailByPool } from 'state/farmsV4/hooks'
import { useAccountV2PendingCakeReward } from 'state/farmsV4/state/accountPositions/hooks/useAccountV2PendingCakeReward'
import { PoolInfo, StablePoolInfo, V2PoolInfo } from 'state/farmsV4/state/type'
import { useChainIdByQuery } from 'state/info/hooks'

export const useV2CakeEarning = (pool: PoolInfo | null | undefined) => {
  const { account } = useAccountActiveChain()
  const cakePrice = useCakePrice()
  const { chainId, lpAddress } = pool || {}
  const { data: pendingCake, isLoading } = useAccountV2PendingCakeReward(account, {
    chainId,
    lpAddress,
    bCakeWrapperAddress: (pool as V2PoolInfo | StablePoolInfo)?.bCakeWrapperAddress,
  })
  const earningsAmount = useMemo(() => +formatBigInt(BigInt(pendingCake ?? 0), 5), [pendingCake])
  const earningsBusd = useMemo(() => {
    return new BigNumber(earningsAmount ?? 0).times(cakePrice.toString()).toNumber()
  }, [cakePrice, earningsAmount])

  return {
    earningsAmount,
    earningsBusd,
    isLoading,
  }
}

export const useV3CakeEarning = (tokenIds: bigint[] = [], chainId: number) => {
  const cakePrice = useCakePrice()
  const { tokenIdResults: results, isLoading } = useStakedPositionsByUser(tokenIds, chainId)
  const earningsAmount = useMemo(() => {
    return results.reduce((acc, pendingCake = 0n) => acc + pendingCake, 0n)
  }, [results])
  const earningsBusd = useMemo(() => {
    return new BigNumber(earningsAmount.toString()).times(cakePrice.toString()).div(1e18).toNumber()
  }, [cakePrice, earningsAmount])

  return {
    earningsAmount: +formatBigInt(earningsAmount, 5),
    earningsBusd,
    isLoading,
  }
}

export const useV3CakeEarningsByPool = (pool: PoolInfo | null | undefined) => {
  const chainId = useChainIdByQuery()
  const { account } = useAccountActiveChain()
  const { data, isLoading } = useAccountPositionDetailByPool<Protocol.V3>(
    pool?.chainId ?? chainId,
    account,
    pool ?? undefined,
  )
  const tokenIds = useMemo(() => {
    if (!data?.length) return []
    return data.filter((item) => item.isStaked).map((item) => item.tokenId)
  }, [data])
  const { earningsBusd, earningsAmount } = useV3CakeEarning(tokenIds, pool?.chainId ?? chainId)
  return {
    earningsBusd,
    earningsAmount,
    isLoading,
  }
}
