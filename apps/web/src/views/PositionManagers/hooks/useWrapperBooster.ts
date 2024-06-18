import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBCakeFarmWrapperBoosterVeCakeContract } from 'hooks/useContract'
import { useMemo } from 'react'
import { Address } from 'viem'

const SHOULD_UPDATE_THRESHOLD = 1.1

export const useWrapperBooster = (bCakeBoosterAddress: Address, boostMultiplier: number, wrapperAddress?: Address) => {
  const bCakeFarmWrapperBoosterVeCakeContract = useBCakeFarmWrapperBoosterVeCakeContract()
  const { account } = useActiveWeb3React()
  const { data, refetch } = useQuery({
    queryKey: ['useWrapperBooster', bCakeBoosterAddress, account, wrapperAddress],
    queryFn: () =>
      bCakeFarmWrapperBoosterVeCakeContract.read.getUserMultiplierByWrapper([account ?? '0x', wrapperAddress ?? '0x']),
    enabled: !!bCakeBoosterAddress && !!account && !!wrapperAddress,
    refetchInterval: 10000,
    staleTime: 10000,
    gcTime: 10000,
  })

  const { data: BOOST_PRECISION } = useQuery({
    queryKey: ['useWrapperBooster_BOOST_PRECISION', bCakeBoosterAddress],
    queryFn: () => bCakeFarmWrapperBoosterVeCakeContract.read.BOOST_PRECISION(),
    enabled: !!bCakeBoosterAddress,
  })

  const veCakeUserMultiplierBeforeBoosted = useMemo(() => {
    return data && BOOST_PRECISION && Boolean(wrapperAddress)
      ? Number(new BigNumber(data.toString()).div(BOOST_PRECISION.toString()))
      : 0
  }, [BOOST_PRECISION, data, wrapperAddress])

  const shouldUpdate = useMemo(() => {
    if (
      (boostMultiplier &&
        veCakeUserMultiplierBeforeBoosted &&
        boostMultiplier * SHOULD_UPDATE_THRESHOLD <= veCakeUserMultiplierBeforeBoosted) ||
      (boostMultiplier === 1 && veCakeUserMultiplierBeforeBoosted > boostMultiplier)
    )
      return true
    return false
  }, [boostMultiplier, veCakeUserMultiplierBeforeBoosted])

  return { veCakeUserMultiplierBeforeBoosted, refetchWrapperBooster: refetch, shouldUpdate }
}

export const useIsWrapperWhiteList = (bCakeBoosterAddress?: Address, wrapperAddress?: Address) => {
  const bCakeFarmWrapperBoosterVeCakeContract = useBCakeFarmWrapperBoosterVeCakeContract()
  const { data } = useQuery({
    queryKey: ['useIsWrapperWhiteList', bCakeBoosterAddress, wrapperAddress],
    queryFn: () => bCakeFarmWrapperBoosterVeCakeContract.read.whiteListWrapper([wrapperAddress ?? '0x']),
    enabled: !!bCakeBoosterAddress && !!wrapperAddress,
    refetchInterval: 10000,
    staleTime: 10000,
    gcTime: 10000,
  })

  const isBoosterWhiteList = useMemo(() => {
    if (!bCakeBoosterAddress || !wrapperAddress) return false
    return Boolean(data)
  }, [bCakeBoosterAddress, data, wrapperAddress])

  return { isBoosterWhiteList }
}
