import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import { useStakedPositionsByUser } from 'state/farmsV3/hooks'
import { useAccountV2PendingCakeReward } from 'state/farmsV4/state/accountPositions/hooks/useAccountV2PendingCakeReward'
import { getUniversalBCakeWrapperForPool } from 'state/farmsV4/state/poolApr/fetcher'
import { PoolInfo } from 'state/farmsV4/state/type'

export const useV2CakeEarning = (pool: PoolInfo | null | undefined) => {
  const { account } = useAccountActiveChain()
  const cakePrice = useCakePrice()
  const { chainId, lpAddress } = pool || {}
  const bCakeConfig = useMemo(() => {
    return chainId && lpAddress
      ? getUniversalBCakeWrapperForPool({ chainId, lpAddress, protocol: pool?.protocol })
      : null
  }, [chainId, lpAddress, pool?.protocol])
  const { data: pendingCake } = useAccountV2PendingCakeReward(account, {
    chainId,
    lpAddress,
    bCakeWrapperAddress: bCakeConfig?.bCakeWrapperAddress,
  })
  const earningsAmount = useMemo(() => +formatBigInt(BigInt(pendingCake ?? 0), 5), [pendingCake])
  const earningsBusd = useMemo(() => {
    return new BigNumber(earningsAmount ?? 0).times(cakePrice.toString()).toNumber()
  }, [cakePrice, earningsAmount])

  return {
    earningsAmount,
    earningsBusd,
  }
}

export const useV3CakeEarning = (tokenIds: bigint[] = []) => {
  const cakePrice = useCakePrice()
  const {
    tokenIdResults: [pendingCake],
  } = useStakedPositionsByUser(tokenIds)
  const earningsAmount = useMemo(() => +formatBigInt(pendingCake || 0n, 4), [pendingCake])
  const earningsBusd = useMemo(() => {
    return new BigNumber(pendingCake.toString()).times(cakePrice.toString()).div(1e18).toNumber()
  }, [cakePrice, pendingCake])

  return {
    earningsAmount,
    earningsBusd,
  }
}
