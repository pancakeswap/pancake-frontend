import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useFarmBooster } from 'hooks/useContract'
import farmBoosterAbi from 'config/abi/farmBooster.json'
import { FixedNumber } from '@ethersproject/bignumber'
import { multicallv2 } from 'utils/multicall'
import useSWR from 'swr'
import { YieldBoosterState } from './useYieldBoosterState'

const PRECISION_FACTOR = FixedNumber.from('1000000000000')

async function getPublicMultipler({ farmBoosterContract }) {
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

  return boostPercent.toString()
}

async function getUserMultipler({ farmBoosterContract, account, proxyPid }) {
  const calls = [
    {
      address: farmBoosterContract.address,
      name: 'getUserMultiplier',
      params: [account, proxyPid],
    },
    {
      address: farmBoosterContract.address,
      name: 'BOOST_PRECISION',
    },
  ]

  const data = await multicallv2(farmBoosterAbi, calls)

  if (!data) return 0

  const [[multipler], [BOOST_PRECISION]] = data

  return PRECISION_FACTOR.addUnsafe(FixedNumber.from(multipler))
    .subUnsafe(FixedNumber.from(BOOST_PRECISION))
    .divUnsafe(PRECISION_FACTOR)
}

export default function useBoostMultipler({ proxyPid, boosterState }) {
  const farmBoosterContract = useFarmBooster()

  const { account } = useActiveWeb3React()

  const shouldMaxUp = [YieldBoosterState.UNCONNECTED, YieldBoosterState.NO_LOCKED, YieldBoosterState.NO_LP].includes(
    boosterState,
  )

  const { data } = useSWR(['boostMultipler', shouldMaxUp ? 'public' : `user${proxyPid}`], async () =>
    (await shouldMaxUp)
      ? getPublicMultipler({
          farmBoosterContract,
        })
      : getUserMultipler({ farmBoosterContract, proxyPid, account }),
  )

  return data
}
