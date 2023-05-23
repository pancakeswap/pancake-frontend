import farmBoosterAbi from 'config/abi/bCakeFarmBoosterV3.json'
import masterChefAbi from 'config/abi/masterChefV3.json'
import { FixedNumber } from 'ethers'
import { multicallv3 } from 'utils/multicall'

import _toNumber from 'lodash/toNumber'

const PRECISION_FACTOR = FixedNumber.from('1000000000000') // 1e12

export async function getPublicMultiplier({ farmBoosterContract, chainId }): Promise<number> {
  const calls = [
    {
      address: farmBoosterContract.address,
      name: 'cA',
      abi: farmBoosterAbi,
    },
    {
      address: farmBoosterContract.address,
      name: 'CA_PRECISION',
      abi: farmBoosterAbi,
    },
    {
      address: farmBoosterContract.address,
      name: 'BOOST_PRECISION',
      abi: farmBoosterAbi,
    },
  ]

  const data = await multicallv3({ calls, chainId: +chainId })

  if (!data) return 0

  const [[cA], [CA_PRECISION], [BOOST_PRECISION]] = data

  const MAX_BOOST_PRECISION = FixedNumber.from(CA_PRECISION)
    .divUnsafe(FixedNumber.from(cA))
    .mulUnsafe(PRECISION_FACTOR)
    .subUnsafe(FixedNumber.from(BOOST_PRECISION))

  const boostPercent = PRECISION_FACTOR.addUnsafe(MAX_BOOST_PRECISION).divUnsafe(PRECISION_FACTOR)

  return _toNumber(boostPercent.round(3).toString())
}

export async function getUserMultiplier({ farmBoosterContract, account, pid }): Promise<number> {
  const calls = [
    {
      address: farmBoosterContract.address,
      name: 'getUserMultiplier',
      abi: farmBoosterAbi,
      params: [account, pid],
    },
    {
      address: farmBoosterContract.address,
      abi: farmBoosterAbi,
      name: 'BOOST_PRECISION',
    },
  ]

  const data = await multicallv3({ calls })

  if (!data) return 0

  const [[multiplier], [BOOST_PRECISION]] = data

  return _toNumber(
    PRECISION_FACTOR.addUnsafe(FixedNumber.from(multiplier))
      .subUnsafe(FixedNumber.from(BOOST_PRECISION))
      .divUnsafe(PRECISION_FACTOR)
      .round(3)
      .toString(),
  )
}

export async function getMultiplierFromMC({ pid, proxyAddress, masterChefContract }): Promise<number> {
  const calls = [
    {
      address: masterChefContract.address,
      name: 'getBoostMultiplier',
      params: [proxyAddress, pid],
      abi: masterChefAbi,
    },
  ]
  const data = await multicallv3({ calls })

  if (!data?.length) return 0

  const [[boostMultiplier]] = data

  return _toNumber(FixedNumber.from(boostMultiplier).divUnsafe(PRECISION_FACTOR).round(3).toString())
}
