import BN from 'bignumber.js'
import { bCakeFarmBoosterV3ABI } from 'config/abi/bCakeFarmBoosterV3'
import _toNumber from 'lodash/toNumber'
import { publicClient } from 'utils/wagmi'

export const PRECISION_FACTOR = new BN('1000000000000') // 1e12

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

  const MAX_BOOST_PRECISION = new BN(CA_PRECISION.toString())
    .div(new BN(cA.toString()))
    .times(PRECISION_FACTOR)
    .minus(new BN(BOOST_PRECISION.toString()))

  const boostPercent = PRECISION_FACTOR.plus(MAX_BOOST_PRECISION).div(PRECISION_FACTOR)

  return _toNumber(boostPercent.toFixed(3).toString())
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
    PRECISION_FACTOR.plus(new BN(multiplier.toString()))
      .minus(new BN(BOOST_PRECISION.toString()))
      .div(PRECISION_FACTOR)
      .toString(),
  )
}
