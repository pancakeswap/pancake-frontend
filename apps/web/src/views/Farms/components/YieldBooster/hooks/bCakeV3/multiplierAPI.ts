import { bCakeFarmBoosterVeCakeABI } from '@pancakeswap/farms/constants/v3/abi/bCakeFarmBoosterVeCake'
import BN from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { publicClient } from 'utils/wagmi'

export const PRECISION_FACTOR = new BN('1000000000000') // 1e12

export async function getPublicMultiplier({ farmBoosterContract, chainId }): Promise<number> {
  const [cAResult, caPercisionResult, boostPercisionResult] = await publicClient({ chainId }).multicall({
    contracts: [
      {
        address: farmBoosterContract.address,
        functionName: 'cA',
        abi: bCakeFarmBoosterVeCakeABI,
      },
      {
        address: farmBoosterContract.address,
        functionName: 'CA_PRECISION',
        abi: bCakeFarmBoosterVeCakeABI,
      },
      {
        address: farmBoosterContract.address,
        functionName: 'BOOST_PRECISION',
        abi: bCakeFarmBoosterVeCakeABI,
      },
    ],
  })

  if (!cAResult.result || !caPercisionResult.result || !boostPercisionResult) return 0

  const [cA, CA_PRECISION, BOOST_PRECISION] = [cAResult.result, caPercisionResult.result, boostPercisionResult.result]

  const MAX_BOOST_PRECISION = new BN(CA_PRECISION.toString())
    .div(new BN(cA.toString()))
    .times(PRECISION_FACTOR)
    .minus(new BN(BOOST_PRECISION?.toString() ?? '0'))

  const boostPercent = PRECISION_FACTOR.plus(MAX_BOOST_PRECISION).div(PRECISION_FACTOR)

  return _toNumber(boostPercent.toFixed(3).toString())
}

export async function getUserMultiplier({ address, tokenId, chainId }): Promise<number> {
  const [multiplierResult, boostPrecisionResult] = await publicClient({ chainId }).multicall({
    contracts: [
      {
        address,
        functionName: 'getUserMultiplier',
        abi: bCakeFarmBoosterVeCakeABI,
        args: [tokenId],
      },
      {
        address,
        abi: bCakeFarmBoosterVeCakeABI,
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
