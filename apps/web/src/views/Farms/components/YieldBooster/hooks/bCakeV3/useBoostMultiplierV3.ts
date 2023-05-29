import { bCakeFarmBoosterV3ABI } from 'config/abi/bCakeFarmBoosterV3'
import { FixedNumber } from 'ethers'
import { publicClient } from 'utils/wagmi'

import _toNumber from 'lodash/toNumber'

const PRECISION_FACTOR = FixedNumber.from('1000000000000') // 1e12

export async function getPublicMultiplier({ farmBoosterContract, chainId }): Promise<number> {
  const [cAResult, caPercisionResult, boostPercisionResult] = await publicClient({ chainId }).multicall({
    contracts: [
      {
        address: farmBoosterContract.address,
        functionName: 'cA',
        abi: bCakeFarmBoosterV3ABI,
      },
      {
        address: farmBoosterContract.address,
        functionName: 'CA_PRECISION',
        abi: bCakeFarmBoosterV3ABI,
      },
      {
        address: farmBoosterContract.address,
        functionName: 'BOOST_PRECISION',
        abi: bCakeFarmBoosterV3ABI,
      },
    ],
  })

  if (!cAResult.result || !caPercisionResult.result || !boostPercisionResult) return 0

  const [cA, CA_PRECISION, BOOST_PRECISION] = [cAResult.result, caPercisionResult.result, boostPercisionResult.result]

  const MAX_BOOST_PRECISION = FixedNumber.from(CA_PRECISION)
    .divUnsafe(FixedNumber.from(cA))
    .mulUnsafe(PRECISION_FACTOR)
    .subUnsafe(FixedNumber.from(BOOST_PRECISION))

  const boostPercent = PRECISION_FACTOR.addUnsafe(MAX_BOOST_PRECISION).divUnsafe(PRECISION_FACTOR)

  return _toNumber(boostPercent.round(3).toString())
}

export async function getUserMultiplier({ address, tokenId, chainId }): Promise<number> {
  const [multiplierResult, boostPrecisionResult] = await publicClient({ chainId }).multicall({
    contracts: [
      {
        address,
        functionName: 'getUserMultiplier',
        abi: bCakeFarmBoosterV3ABI,
        args: [tokenId],
      },
      {
        address,
        abi: bCakeFarmBoosterV3ABI,
        functionName: 'BOOST_PRECISION',
      },
    ],
  })

  if (!multiplierResult.result || !boostPrecisionResult.result) return 0

  const [multiplier, BOOST_PRECISION] = [multiplierResult.result, boostPrecisionResult.result]

  return _toNumber(
    PRECISION_FACTOR.addUnsafe(FixedNumber.from(multiplier))
      .subUnsafe(FixedNumber.from(BOOST_PRECISION))
      .divUnsafe(PRECISION_FACTOR)
      .round(3)
      .toString(),
  )
}
