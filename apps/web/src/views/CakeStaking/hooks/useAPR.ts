import { ChainId } from '@pancakeswap/chains'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { CAKE_PER_BLOCK } from 'config'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { revenueSharingPoolProxyABI } from 'config/abi/revenueSharingPoolProxy'
import { WEEK } from 'config/constants/veCake'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { getMasterChefV2Address, getRevenueSharingVeCakeAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { useContractRead } from 'wagmi'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'
import { useVeCakeTotalSupply } from './useVeCakeTotalSupply'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useUserCakeTVL = (): bigint => {
  const { data } = useVeCakeUserInfo()

  return useMemo(() => {
    if (!data) return 0n
    return data.amount + data.cakeAmount
  }, [data])
}

// A mock pool which OP harvests weekly and inject rewards to RevenueSharingVeCake
const pid = 172n

export const useUserSharesPercent = (): Percent => {
  const { balance } = useVeCakeBalance()
  const { data: totalSupply } = useVeCakeTotalSupply()

  return useMemo(() => {
    if (!totalSupply || totalSupply.isZero()) return new Percent(0, 1)
    return new Percent(balance.toString(), totalSupply.toString())
  }, [balance, totalSupply])
}

export const useCakePoolEmission = () => {
  const { chainId } = useActiveChainId()
  const client = useMemo(() => {
    return publicClient({
      chainId: chainId && [ChainId.BSC, ChainId.BSC_TESTNET].includes(chainId) ? chainId : ChainId.BSC,
    })
  }, [chainId])

  const { data } = useQuery({
    queryKey: ['vecake/cakePoolEmission', client.chain.id],

    queryFn: async () => {
      const response = await client.multicall({
        contracts: [
          {
            address: getMasterChefV2Address(client.chain.id),
            abi: masterChefV2ABI,
            functionName: 'cakeRateToSpecialFarm',
          } as const,
          {
            address: getMasterChefV2Address(client.chain.id),
            abi: masterChefV2ABI,
            functionName: 'poolInfo',
            args: [pid],
          } as const,
          {
            address: getMasterChefV2Address(client.chain.id),
            abi: masterChefV2ABI,
            functionName: 'totalSpecialAllocPoint',
          } as const,
        ],
        allowFailure: false,
      })

      const cakeRateToSpecialFarm = response[0] ?? 0n
      const allocPoint = response[1][2] ?? 0n
      const totalSpecialAllocPoint = response[2] ?? 0n
      return [cakeRateToSpecialFarm, allocPoint, totalSpecialAllocPoint]
    },
  })

  return useMemo(() => {
    if (!data) return BIG_ZERO
    const [cakeRateToSpecialFarm, allocPoint, totalSpecialAllocPoint] = data

    return new BigNumber(CAKE_PER_BLOCK)
      .times(new BigNumber(cakeRateToSpecialFarm.toString()).div(1e12))
      .times(allocPoint.toString())
      .div((totalSpecialAllocPoint ?? 1n).toString())
  }, [data])
}

export const useCakePoolAPR = () => {
  const cakePoolEmission = useCakePoolEmission()
  const userSharesPercent = useUserSharesPercent()
  const userCakeTVL = useUserCakeTVL()

  return useMemo(() => {
    if (!cakePoolEmission || !userSharesPercent?.denominator || !userCakeTVL) return new Percent(0, 1)

    return new Percent(
      new BigNumber(cakePoolEmission)
        .times(1e18)
        .times(24 * 60 * 60 * 365)
        .times(userSharesPercent.numerator.toString())
        .toFixed(0),
      (userCakeTVL * userSharesPercent.denominator * 3n).toString(),
    )
  }, [cakePoolEmission, userSharesPercent, userCakeTVL])
}

const SECONDS_IN_YEAR = 31536000 // 365 * 24 * 60 * 60

export const useRevShareEmission = () => {
  const { chainId } = useActiveChainId()
  const currentTimestamp = useCurrentBlockTimestamp()
  const { data: totalDistributed } = useContractRead({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingVeCakeAddress(chainId) ?? getRevenueSharingVeCakeAddress(ChainId.BSC),
    functionName: 'totalDistributed',
    chainId,
  })
  const lastThursday = useMemo(() => {
    return Math.floor(currentTimestamp / WEEK) * WEEK
  }, [currentTimestamp])
  return useMemo(() => {
    if (!totalDistributed) return BIG_ZERO
    // 1700697600 is the timestamp of the first distribution
    return new BigNumber(totalDistributed.toString()).dividedBy(lastThursday - 1700697600)
  }, [totalDistributed, lastThursday])
}

export const useRevenueSharingAPR = () => {
  const userSharesPercent = useUserSharesPercent()
  const userCakeTVL = useUserCakeTVL()
  const revShareEmission = useRevShareEmission()

  return useMemo(() => {
    if (!revShareEmission || !userSharesPercent?.denominator || !userCakeTVL) return new Percent(0, 1)
    return new Percent(
      new BigNumber(revShareEmission).times(SECONDS_IN_YEAR).times(userSharesPercent.numerator.toString()).toFixed(0),
      (userCakeTVL * userSharesPercent.denominator).toString(),
    )
  }, [revShareEmission, userCakeTVL, userSharesPercent])
}

export const useVeCakeAPR = () => {
  const cakePoolAPR = useCakePoolAPR()
  const revenueSharingAPR = useRevenueSharingAPR()

  const totalAPR = useMemo(() => {
    if (!cakePoolAPR || !revenueSharingAPR) return new Percent(0, 1)
    return cakePoolAPR.add(revenueSharingAPR)
  }, [cakePoolAPR, revenueSharingAPR])

  return {
    totalAPR,
    cakePoolAPR,
    revenueSharingAPR,
  }
}

export const BRIBE_APR = 20
export const useFourYearTotalVeCakeApr = () => {
  const revShareEmission = useRevShareEmission()
  const cakePoolEmission = useCakePoolEmission()
  const { data: totalSupply } = useVeCakeTotalSupply()

  const veCAKEPoolApr = new BigNumber(new BigNumber(cakePoolEmission).div(3).times(24 * 60 * 60 * 365))
    .div(totalSupply.div(1e18))
    .times(100)

  const revShareEmissionApr = new BigNumber(revShareEmission)
    .times(24 * 60 * 60 * 365)
    .div(totalSupply)
    .times(100)

  const total = useMemo(
    () => veCAKEPoolApr.plus(revShareEmissionApr).plus(BRIBE_APR),
    [veCAKEPoolApr, revShareEmissionApr],
  )

  return {
    totalApr: total,
    veCAKEPoolApr: veCAKEPoolApr.toString(),
    revShareEmissionApr: revShareEmissionApr.toString(),
  }
}
