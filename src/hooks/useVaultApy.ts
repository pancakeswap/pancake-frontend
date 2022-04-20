import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { WeiPerEther } from '@ethersproject/constants'
import { BLOCKS_PER_YEAR } from 'config'
import cakeVaultV2Abi from 'config/abi/cakeVaultV2.json'
import masterChefAbi from 'config/abi/masterchef.json'
import { useCallback, useMemo } from 'react'
import { useCakeVault } from 'state/pools/hooks'
import useSWRImmutable from 'swr/immutable'
import { getCakeVaultAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { multicallv2 } from '../utils/multicall'
import { immutableMiddleware, useSWRMulticall } from './useSWRContract'

const masterChefAddress = getMasterChefAddress()
const cakeVaultAddress = getCakeVaultAddress()

// default
export const DEFAULT_MAX_DURATION = 31536000
const DEFAULT_BOOST_WEIGHT = BigNumber.from('1000000000000')
const DEFAULT_DURATION_FACTOR = BigNumber.from('31536000')

// constant, consider move it to config
const PRECISION_FACTOR = BigNumber.from('1000000000000')

const getFlexibleApy = (
  totalCakePoolEmissionPerYear: FixedNumber,
  pricePerFullShare: FixedNumber,
  totalShares: FixedNumber,
) =>
  totalCakePoolEmissionPerYear
    .mulUnsafe(FixedNumber.from(WeiPerEther))
    .divUnsafe(pricePerFullShare)
    .divUnsafe(totalShares)
    .mulUnsafe(FixedNumber.from(100))

const _getBoostFactor = (boostWeight: BigNumber, duration: number, durationFactor: BigNumber) => {
  return FixedNumber.from(boostWeight)
    .mulUnsafe(FixedNumber.from(Math.max(duration, 0)))
    .divUnsafe(FixedNumber.from(durationFactor))
    .divUnsafe(FixedNumber.from(PRECISION_FACTOR))
}

const getLockedApy = (flexibleApy: string, boostFactor: FixedNumber) =>
  FixedNumber.from(flexibleApy).mulUnsafe(boostFactor.addUnsafe(FixedNumber.from('1')))

const cakePoolPID = 0

export function useVaultApy({ duration = DEFAULT_MAX_DURATION }: { duration?: number } = {}) {
  const { totalShares = BIG_ZERO, pricePerFullShare = BIG_ZERO } = useCakeVault()
  const totalSharesAsEtherBN = useMemo(() => FixedNumber.from(totalShares.toString()), [totalShares])
  const pricePerFullShareAsEtherBN = useMemo(() => FixedNumber.from(pricePerFullShare.toString()), [pricePerFullShare])

  const { data: totalCakePoolEmissionPerYear } = useSWRImmutable('masterChef-total-cake-pool-emission', async () => {
    const calls = [
      {
        address: masterChefAddress,
        name: 'cakePerBlock',
        params: [false],
      },
      {
        address: masterChefAddress,
        name: 'poolInfo',
        params: [cakePoolPID],
      },
      {
        address: masterChefAddress,
        name: 'totalSpecialAllocPoint',
      },
    ]

    const [[specialFarmsPerBlock], cakePoolInfo, [totalSpecialAllocPoint]] = await multicallv2(masterChefAbi, calls)

    const cakePoolSharesInSpecialFarms = FixedNumber.from(cakePoolInfo.allocPoint).divUnsafe(
      FixedNumber.from(totalSpecialAllocPoint),
    )
    return FixedNumber.from(specialFarmsPerBlock)
      .mulUnsafe(FixedNumber.from(BLOCKS_PER_YEAR))
      .mulUnsafe(cakePoolSharesInSpecialFarms)
  })

  const calls = useMemo(
    () =>
      ['BOOST_WEIGHT', 'DURATION_FACTOR'].map((name) => ({
        address: cakeVaultAddress,
        name,
      })),
    [],
  )
  const { data } = useSWRMulticall(cakeVaultV2Abi, calls, {
    use: [immutableMiddleware],
  })

  const flexibleApy = useMemo(
    () =>
      totalCakePoolEmissionPerYear &&
      !pricePerFullShareAsEtherBN.isZero() &&
      !totalSharesAsEtherBN.isZero() &&
      getFlexibleApy(totalCakePoolEmissionPerYear, pricePerFullShareAsEtherBN, totalSharesAsEtherBN).toString(),
    [pricePerFullShareAsEtherBN, totalCakePoolEmissionPerYear, totalSharesAsEtherBN],
  )

  const boostWeight: BigNumber = data?.[0][0] || DEFAULT_BOOST_WEIGHT
  const durationFactor: BigNumber = data?.[1][0] || DEFAULT_DURATION_FACTOR

  const boostFactor = useMemo(
    () => _getBoostFactor(boostWeight, duration, durationFactor),
    [boostWeight, duration, durationFactor],
  )

  const lockedApy = useMemo(() => {
    return flexibleApy && getLockedApy(flexibleApy, boostFactor).toString()
  }, [boostFactor, flexibleApy])

  const getBoostFactor = useCallback(
    (adjustDuration: number) => _getBoostFactor(boostWeight, adjustDuration, durationFactor),
    [boostWeight, durationFactor],
  )

  return {
    flexibleApy,
    lockedApy,
    getLockedApy: useCallback(
      (adjustDuration: number) => flexibleApy && getLockedApy(flexibleApy, getBoostFactor(adjustDuration)).toString(),
      [flexibleApy, getBoostFactor],
    ),
    boostFactor: useMemo(() => boostFactor.addUnsafe(FixedNumber.from('1')), [boostFactor]),
    getBoostFactor: useCallback(
      (adjustDuration: number) => getBoostFactor(adjustDuration).addUnsafe(FixedNumber.from('1')),
      [getBoostFactor],
    ),
  }
}
