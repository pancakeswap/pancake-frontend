import BN from 'bignumber.js'
import { parseNumberToFraction, formatFraction } from '@pancakeswap/utils/formatFractions'
import { BigintIsh, ZERO } from '@pancakeswap/sdk'

type BigNumberish = BN | number | string

interface FarmAprParams {
  poolWeight: BigNumberish
  // Total tvl staked in farm in usd
  tvlUsd: BigNumberish
  cakePriceUsd: BigNumberish
  cakePerSecond: BigNumberish

  precision?: number
}

const SECONDS_FOR_YEAR = 365 * 60 * 60 * 24

const isValid = (num: BigNumberish) => {
  const bigNumber = new BN(num)
  return bigNumber.isFinite() && bigNumber.isPositive()
}

const formatNumber = (bn: BN, precision: number) => {
  return formatFraction(parseNumberToFraction(bn.toNumber(), precision), precision)
}

export function getFarmApr({ poolWeight, tvlUsd, cakePriceUsd, cakePerSecond, precision = 6 }: FarmAprParams) {
  if (!isValid(poolWeight) || !isValid(tvlUsd) || !isValid(cakePriceUsd) || !isValid(cakePerSecond)) {
    return '0'
  }

  const cakeRewardPerYear = new BN(cakePerSecond).times(SECONDS_FOR_YEAR)
  const farmApr = new BN(poolWeight).times(cakeRewardPerYear).times(cakePriceUsd).div(tvlUsd).times(100)

  if (farmApr.isZero()) {
    return '0'
  }

  return formatNumber(farmApr, precision)
}

export interface PositionFarmAprParams extends Omit<FarmAprParams, 'tvlUsd'> {
  // Position liquidity
  liquidity: BigintIsh

  // Total staked liquidity in farm
  totalStakedLiquidity: BigintIsh

  // Position tvl in usd
  positionTvlUsd: BigNumberish
}

export function getPositionFarmApr({
  poolWeight,
  positionTvlUsd,
  cakePriceUsd,
  cakePerSecond,
  liquidity,
  totalStakedLiquidity,
  precision = 6,
}: PositionFarmAprParams) {
  if (
    !isValid(poolWeight) ||
    !isValid(positionTvlUsd) ||
    !isValid(cakePriceUsd) ||
    !isValid(cakePerSecond) ||
    BigInt(liquidity) === ZERO ||
    BigInt(totalStakedLiquidity) === ZERO
  ) {
    return '0'
  }

  const cakeRewardPerYear = new BN(cakePerSecond).times(SECONDS_FOR_YEAR)
  const positionApr = new BN(poolWeight)
    .times(cakeRewardPerYear)
    .times(cakePriceUsd)
    .times(liquidity.toString())
    .div((BigInt(liquidity) + BigInt(totalStakedLiquidity)).toString())
    .div(positionTvlUsd)
    .times(100)

  return formatNumber(positionApr, precision)
}
