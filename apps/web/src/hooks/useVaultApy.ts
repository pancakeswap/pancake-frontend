import BN from 'bignumber.js'
import toString from 'lodash/toString'
import { BLOCKS_PER_YEAR } from 'config'
import { useCallback, useMemo } from 'react'
import { useCakeVault } from 'state/pools/hooks'
import useSWRImmutable from 'swr/immutable'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { getMasterChefV2Address } from 'utils/addressHelpers'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { BOOST_WEIGHT, DURATION_FACTOR, MAX_LOCK_DURATION } from '@pancakeswap/pools'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/sdk'

const masterChefAddress = getMasterChefV2Address()

// default
const DEFAULT_PERFORMANCE_FEE_DECIMALS = 2

const PRECISION_FACTOR = new BN('1000000000000')
const WeiPerEther = new BN('1000000000000000000')

const getFlexibleApy = (totalCakePoolEmissionPerYear: BN, pricePerFullShare: BN, totalShares: BN) =>
  totalCakePoolEmissionPerYear.times(WeiPerEther).div(pricePerFullShare).div(totalShares).times(100)

const _getBoostFactor = (boostWeight: bigint, duration: number, durationFactor: bigint) => {
  return new BN(boostWeight.toString())
    .times(new BN(Math.max(duration, 0)))
    .div(new BN(durationFactor.toString()))
    .div(PRECISION_FACTOR)
}

const getLockedApy = (flexibleApy: string, boostFactor: BN) => new BN(flexibleApy).times(boostFactor.plus(1))

const cakePoolPID = 0

export function useVaultApy({ duration = MAX_LOCK_DURATION }: { duration?: number } = {}) {
  const {
    totalShares = BIG_ZERO,
    pricePerFullShare = BIG_ZERO,
    fees: { performanceFeeAsDecimal } = { performanceFeeAsDecimal: DEFAULT_PERFORMANCE_FEE_DECIMALS },
  } = useCakeVault()

  const totalSharesAsEtherBN = useMemo(() => new BN(totalShares.toString()), [totalShares])
  const pricePerFullShareAsEtherBN = useMemo(() => new BN(pricePerFullShare.toString()), [pricePerFullShare])

  const { data: totalCakePoolEmissionPerYear } = useSWRImmutable('masterChef-total-cake-pool-emission', async () => {
    const bscClient = publicClient({ chainId: ChainId.BSC })

    const [specialFarmsPerBlock, cakePoolInfo, totalSpecialAllocPoint] = await bscClient.multicall({
      contracts: [
        {
          address: masterChefAddress,
          abi: masterChefV2ABI,
          functionName: 'cakePerBlock',
          args: [false],
        },
        {
          address: masterChefAddress,
          abi: masterChefV2ABI,
          functionName: 'poolInfo',
          args: [BigInt(cakePoolPID)],
        },
        {
          address: masterChefAddress,
          abi: masterChefV2ABI,
          functionName: 'totalSpecialAllocPoint',
        },
      ],
      allowFailure: false,
    })

    const allocPoint = cakePoolInfo[2]

    const cakePoolSharesInSpecialFarms = new BN(allocPoint.toString()).div(new BN(totalSpecialAllocPoint.toString()))
    return new BN(specialFarmsPerBlock.toString()).times(BLOCKS_PER_YEAR).times(cakePoolSharesInSpecialFarms)
  })

  const flexibleApy = useMemo(
    () =>
      totalCakePoolEmissionPerYear &&
      !pricePerFullShareAsEtherBN.isZero() &&
      !totalSharesAsEtherBN.isZero() &&
      getFlexibleApy(totalCakePoolEmissionPerYear, pricePerFullShareAsEtherBN, totalSharesAsEtherBN).toString(),
    [pricePerFullShareAsEtherBN, totalCakePoolEmissionPerYear, totalSharesAsEtherBN],
  )

  const boostFactor = useMemo(() => _getBoostFactor(BOOST_WEIGHT, duration, DURATION_FACTOR), [duration])

  const lockedApy = useMemo(() => {
    return flexibleApy && getLockedApy(flexibleApy, boostFactor).toString()
  }, [boostFactor, flexibleApy])

  const getBoostFactor = useCallback(
    (adjustDuration: number) => _getBoostFactor(BOOST_WEIGHT, adjustDuration, DURATION_FACTOR),
    [],
  )

  const flexibleApyNoFee = useMemo(() => {
    if (flexibleApy && performanceFeeAsDecimal) {
      const rewardPercentageNoFee = toString(1 - performanceFeeAsDecimal / 100)

      return new BN(flexibleApy).times(rewardPercentageNoFee).toString()
    }

    return flexibleApy
  }, [flexibleApy, performanceFeeAsDecimal])

  return {
    flexibleApy: flexibleApyNoFee,
    lockedApy,
    getLockedApy: useCallback(
      (adjustDuration: number) => flexibleApy && getLockedApy(flexibleApy, getBoostFactor(adjustDuration)).toString(),
      [flexibleApy, getBoostFactor],
    ),
    boostFactor: useMemo(() => boostFactor.plus('1'), [boostFactor]),
    getBoostFactor: useCallback((adjustDuration: number) => getBoostFactor(adjustDuration).plus('1'), [getBoostFactor]),
  }
}
