import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import farmBoosterAbi from 'config/abi/farmBooster.json'
import { FixedNumber } from '@ethersproject/bignumber'
import { multicallv2 } from 'utils/multicall'
import useSWR from 'swr'
import _toNumber from 'lodash/toNumber'
import { YieldBoosterState } from './useYieldBoosterState'

const PRECISION_FACTOR = FixedNumber.from('1000000000000')

async function getPublicMultipler({ farmBoosterContract }): Promise<number> {
  const calls = [
    {
      address: farmBoosterContract.address,
      name: 'cA',
    },
    {
      address: farmBoosterContract.address,
      name: 'CA_PRECISION',
    },
    {
      address: farmBoosterContract.address,
      name: 'BOOST_PRECISION',
    },
  ]

  const data = await multicallv2(farmBoosterAbi, calls)

  if (!data) return 0

  const [[cA], [CA_PRECISION], [BOOST_PRECISION]] = data

  const MAX_BOOST_PRECISION = FixedNumber.from(CA_PRECISION)
    .divUnsafe(FixedNumber.from(cA))
    .mulUnsafe(PRECISION_FACTOR)
    .subUnsafe(FixedNumber.from(BOOST_PRECISION))

  const boostPercent = PRECISION_FACTOR.addUnsafe(MAX_BOOST_PRECISION).divUnsafe(PRECISION_FACTOR)

  return _toNumber(boostPercent.round(2).toString())
}

async function getUserMultipler({ farmBoosterContract, account, pid }): Promise<number> {
  const calls = [
    {
      address: farmBoosterContract.address,
      name: 'getUserMultiplier',
      params: [account, pid],
    },
    {
      address: farmBoosterContract.address,
      name: 'BOOST_PRECISION',
    },
  ]

  const data = await multicallv2(farmBoosterAbi, calls)

  if (!data) return 0

  const [[multipler], [BOOST_PRECISION]] = data

  return _toNumber(
    PRECISION_FACTOR.addUnsafe(FixedNumber.from(multipler))
      .subUnsafe(FixedNumber.from(BOOST_PRECISION))
      .divUnsafe(PRECISION_FACTOR)
      .round(2)
      .toString(),
  )
}

export default function useBoostMultipler({ pid, boosterState }): number {
  const farmBoosterContract = useBCakeFarmBoosterContract()

  const { account } = useActiveWeb3React()

  const shouldMaxUp = [YieldBoosterState.UNCONNECTED, YieldBoosterState.NO_LOCKED, YieldBoosterState.NO_LP].includes(
    boosterState,
  )

  const { data } = useSWR(['boostMultipler', shouldMaxUp ? 'public' : `user${pid}`], async () =>
    shouldMaxUp
      ? getPublicMultipler({
          farmBoosterContract,
        })
      : getUserMultipler({ farmBoosterContract, pid, account }),
  )

  return data
}
