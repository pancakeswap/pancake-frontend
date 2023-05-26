import { useBCakeFarmBoosterContract, useMasterchef } from 'hooks/useContract'
import BN from 'bignumber.js'
import { useCallback } from 'react'
import useSWR from 'swr'
import _toNumber from 'lodash/toNumber'
import { Address, useAccount } from 'wagmi'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { bCakeFarmBoosterABI } from 'config/abi/bCakeFarmBooster'
import { YieldBoosterState } from './useYieldBoosterState'

const PRECISION_FACTOR = new BN('1000000000000') // 1e12

async function getPublicMultiplier({ farmBoosterContract }): Promise<number> {
  const [cAResult, caPercisionResult, boostPercisionResult] = await publicClient({ chainId: ChainId.BSC }).multicall({
    contracts: [
      {
        address: farmBoosterContract.address,
        abi: bCakeFarmBoosterABI,
        functionName: 'cA',
      },
      {
        address: farmBoosterContract.address,
        abi: bCakeFarmBoosterABI,
        functionName: 'CA_PRECISION',
      },
      {
        address: farmBoosterContract.address,
        abi: bCakeFarmBoosterABI,
        functionName: 'BOOST_PRECISION',
      },
    ],
    allowFailure: true,
  })

  if (!cAResult.result || !caPercisionResult.result || !boostPercisionResult) return 0

  const [cA, CA_PRECISION, BOOST_PRECISION] = [cAResult.result, caPercisionResult.result, boostPercisionResult.result]

  const MAX_BOOST_PRECISION = new BN(CA_PRECISION.toString())
    .div(new BN(cA.toString()))
    .times(PRECISION_FACTOR)
    .minus(new BN(BOOST_PRECISION.toString()))

  const boostPercent = PRECISION_FACTOR.plus(MAX_BOOST_PRECISION).div(PRECISION_FACTOR)

  return _toNumber(boostPercent.toFixed(3).toString())
}

async function getUserMultiplier({ farmBoosterContract, account, pid }): Promise<number> {
  const [multiplierResult, boostPrecisionResult] = await publicClient({ chainId: ChainId.BSC }).multicall({
    contracts: [
      {
        address: farmBoosterContract.address,
        abi: bCakeFarmBoosterABI,
        functionName: 'getUserMultiplier',
        args: [account, BigInt(pid)],
      },
      {
        address: farmBoosterContract.address,
        abi: bCakeFarmBoosterABI,
        functionName: 'BOOST_PRECISION',
      },
    ],
    allowFailure: true,
  })

  if (!multiplierResult.result || !boostPrecisionResult.result) return 0

  const [multiplier, BOOST_PRECISION] = [multiplierResult.result, boostPrecisionResult.result]

  return _toNumber(
    PRECISION_FACTOR.plus(new BN(multiplier.toString()))
      .minus(new BN(BOOST_PRECISION.toString()))
      .div(PRECISION_FACTOR)
      .toFixed(3)
      .toString(),
  )
}

async function getMultiplierFromMC({
  pid,
  proxyAddress,
  masterChefContract,
}: {
  pid: number
  proxyAddress: Address
  masterChefContract: ReturnType<typeof useMasterchef>
}): Promise<number> {
  const boostMultiplier = await masterChefContract.read.getBoostMultiplier([proxyAddress, BigInt(pid)])

  if (!boostMultiplier) return 0

  return _toNumber(new BN(boostMultiplier.toString()).div(PRECISION_FACTOR).toFixed(3).toString())
}

export default function useBoostMultiplier({ pid, boosterState, proxyAddress }): number {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const masterChefContract = useMasterchef()

  const { address: account } = useAccount()

  const shouldGetFromSC = [YieldBoosterState.DEACTIVE, YieldBoosterState.ACTIVE, YieldBoosterState.MAX].includes(
    boosterState,
  )
  const should1X = [YieldBoosterState.LOCKED_END].includes(boosterState)

  const getMultiplier = useCallback(async () => {
    if (shouldGetFromSC) {
      return getMultiplierFromMC({ pid, masterChefContract, proxyAddress })
    }

    return should1X
      ? getUserMultiplier({ farmBoosterContract, pid, account })
      : getPublicMultiplier({
          farmBoosterContract,
        })
  }, [farmBoosterContract, masterChefContract, should1X, shouldGetFromSC, pid, account, proxyAddress])

  const cacheName = shouldGetFromSC ? `proxy${pid}` : should1X ? `user${pid}` : `public${pid}`

  const { data } = useSWR(['boostMultiplier', cacheName], getMultiplier)

  return data || 0
}
