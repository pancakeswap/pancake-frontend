/* eslint-disable camelcase */

import { ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'
import { Pool } from '@pancakeswap/uikit'
import { HexString, TypeTagParser } from 'aptos'
import { PoolCategory } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import _get from 'lodash/get'
import { FixedNumber } from '@ethersproject/bignumber'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { SECONDS_IN_YEAR } from 'config'

import { PoolResource } from './types'
import { ACC_CAKE_PRECISION } from './constants'

const getSecondsLeftFromNow = (timestamp: number) => {
  const now = Math.floor(Date.now() / 1000)

  return Number.isFinite(timestamp) && timestamp < now ? now - timestamp : 0
}

export function getFarmTokenPerSecond({
  lastRewardTimestamp,
  rewardPerSecond,
  currentRewardDebt,
  tokenPerShare,
  precisionFactor,
  totalStake,
  userStakedAmount,
}) {
  if (!userStakedAmount) return '0'

  const multiplier = FixedNumber.from(getSecondsLeftFromNow(lastRewardTimestamp))

  const rewardPendingToken = FixedNumber.from(rewardPerSecond).mulUnsafe(multiplier)

  const fPrecisionFactor = FixedNumber.from(precisionFactor)

  const rewardDebt = FixedNumber.from(currentRewardDebt)
  const latestTokenPerShare = FixedNumber.from(tokenPerShare).addUnsafe(
    rewardPendingToken.mulUnsafe(fPrecisionFactor).divUnsafe(FixedNumber.from(totalStake)),
  )

  const pendingReward = FixedNumber.from(userStakedAmount)
    .mulUnsafe(latestTokenPerShare)
    .divUnsafe(fPrecisionFactor)
    .subUnsafe(rewardDebt)
    .toString()

  return pendingReward
}

// In order to calculate, I need tokenPrice from farms
export const getPoolApr = ({ rewardTokenPrice, stakingTokenPrice, tokenPerSecond, totalStaked }) => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerSecond).times(SECONDS_IN_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export const transformPool = (resource: PoolResource, balances): Pool.DeserializedPool<Coin> => {
  const parsedTypeTag = new TypeTagParser(resource.type).parseTypeTag()
  const [typeArg0, typeArg1, typeArg3] = parsedTypeTag.value.type_args

  const [stakingAddress, earningAddress, uidAddress] = [
    `${HexString.fromUint8Array(typeArg0.value.address.address).toShortString()}::${
      typeArg0.value.module_name.value
    }::${typeArg0.value.name.value}`,
    `${HexString.fromUint8Array(typeArg1.value.address.address).toShortString()}::${
      typeArg1.value.module_name.value
    }::${typeArg1.value.name.value}`,
    `${HexString.fromUint8Array(typeArg3.value.address.address).toShortString()}::${
      typeArg3.value.module_name.value
    }::${typeArg3.value.name.value}`,
  ]

  let userData = {
    allowance: new BigNumber(0),
    pendingReward: new BigNumber(0),
    stakedBalance: new BigNumber(0),
    stakingTokenBalance: new BigNumber(0),
  }

  const totalStakedToken = _get(resource, 'data.total_staked_token.value', '0')

  if (balances?.length) {
    const resourceTypes = resource.type
    const foundStakedPoolBalance = balances.find(
      (balance) => balance.type === resourceTypes.replace('PoolInfo', 'UserInfo'),
    )

    if (foundStakedPoolBalance) {
      const foundStakingBalance = balances.find((balance) => balance.type === `0x1::coin::CoinStore<${stakingAddress}>`)
      const amount = _get(foundStakingBalance, 'data.coin.value')

      if (amount) {
        userData = { ...userData, stakingTokenBalance: new BigNumber(amount) }
      }

      const currentRewardDebt = _get(foundStakedPoolBalance, 'data.reward_debt')

      const userStakedAmount = _get(foundStakedPoolBalance, 'data.amount')

      if (userStakedAmount && _toNumber(totalStakedToken)) {
        const lastRewardTimestamp = _toNumber(_get(resource, 'data.last_reward_timestamp'))

        // let multiplier = get_multiplier(pool_info.last_reward_timestamp, timestamp::now_seconds(), pool_info.end_timestamp);
        const multiplier = FixedNumber.from(getSecondsLeftFromNow(lastRewardTimestamp))

        const rewardPerSecond = FixedNumber.from(_get(resource, 'data.reward_per_second'))

        const rewardPendingToken = rewardPerSecond.mulUnsafe(multiplier)

        const tokenPerShare = FixedNumber.from(_get(resource, 'data.acc_token_per_share'))
        const precisionFactor = FixedNumber.from(_get(resource, 'data.precision_factor'))
        const totalStake = FixedNumber.from(totalStakedToken)

        const latestTokenPerShare = tokenPerShare.addUnsafe(
          rewardPendingToken.mulUnsafe(precisionFactor).divUnsafe(totalStake),
        )

        const rewardDebt = FixedNumber.from(currentRewardDebt)

        const pendingReward = FixedNumber.from(userStakedAmount)
          .mulUnsafe(latestTokenPerShare)
          .divUnsafe(precisionFactor)
          .subUnsafe(rewardDebt)

        userData = {
          ...userData,
          pendingReward: new BigNumber(pendingReward.toString()),
          stakedBalance: new BigNumber(userStakedAmount),
        }
      }
    }
  }

  const now = Date.now()

  return {
    sousId: uidAddress,
    contractAddress: {
      [ChainId.TESTNET]: resource.type,
    },
    stakingToken: new Coin(
      ChainId.TESTNET,
      stakingAddress,
      8,
      typeArg0.value.name.value,
      `${typeArg0.value.name.value} coin`,
    ),
    earningToken: new Coin(
      ChainId.TESTNET,
      earningAddress,
      8,
      typeArg1.value.name.value,
      `${typeArg1.value.name.value} coin`,
    ),
    apr: 0,
    earningTokenPrice: 0,
    stakingTokenPrice: 0,

    isFinished: !(now > +resource.data.end_timestamp),
    poolCategory: PoolCategory.CORE,
    startBlock: _toNumber(resource.data.start_timestamp),
    tokenPerBlock: resource.data.reward_per_second,
    stakingLimit: resource.data.pool_limit_per_user ? new BigNumber(resource.data.pool_limit_per_user) : BIG_ZERO,
    totalStaked: new BigNumber(totalStakedToken),

    userData,

    profileRequirement: undefined,
  }
}

export function getRewardPerSecondOfCakeFarm({
  cakePerSecond,
  specialRate,
  regularRate,
  allocPoint,
  specialAllocPoint,
}) {
  const fSpecialRate = FixedNumber.from(specialRate)
  const fRegularRate = FixedNumber.from(regularRate)

  const cakeRate = fSpecialRate.divUnsafe(fSpecialRate.addUnsafe(fRegularRate))

  return FixedNumber.from(cakePerSecond)
    .mulUnsafe(cakeRate.mulUnsafe(FixedNumber.from(allocPoint)).divUnsafe(FixedNumber.from(specialAllocPoint)))
    .toString()
}

export const transformCakePool = ({
  balances,
  cakePoolInfo,
  userInfo,
  masterChefData,
  cakeFarm,
  chainId,
  earningTokenPrice,
}) => {
  const currentRewardDebt = _get(userInfo, 'reward_debt', '0')
  const userStakedAmount = _get(userInfo, 'amount', '0')

  const rewardPerSecond = getRewardPerSecondOfCakeFarm({
    cakePerSecond: masterChefData.cake_per_second,
    specialRate: masterChefData.cake_rate_to_special,
    regularRate: masterChefData.cake_rate_to_regular,
    allocPoint: cakePoolInfo.alloc_point,
    specialAllocPoint: masterChefData.total_special_alloc_point,
  })

  let userData = {
    allowance: new BigNumber(0),
    pendingReward: new BigNumber(0),
    stakedBalance: new BigNumber(0),
    stakingTokenBalance: new BigNumber(0),
  }

  const foundStakingBalance = balances.find(
    (balance) => balance.type === `0x1::coin::CoinStore<${cakeFarm.token.address}>`,
  )

  const amount = _get(foundStakingBalance, 'data.coin.value')

  if (amount) {
    userData = { ...userData, stakingTokenBalance: new BigNumber(amount) }
  }

  const totalStake = _get(cakePoolInfo, 'total_amount', '0')

  if (_toNumber(userStakedAmount) && _toNumber(totalStake)) {
    const pendingReward = getFarmTokenPerSecond({
      lastRewardTimestamp: _toNumber(cakePoolInfo.last_reward_timestamp),
      rewardPerSecond,
      currentRewardDebt,
      tokenPerShare: cakePoolInfo.acc_cake_per_share,
      precisionFactor: ACC_CAKE_PRECISION,
      totalStake: cakePoolInfo.total_amount,
      userStakedAmount,
    })

    userData = {
      ...userData,
      pendingReward: new BigNumber(pendingReward.toString()),
      stakedBalance: new BigNumber(userStakedAmount),
    }
  }

  const apr = getPoolApr({
    rewardTokenPrice: _toNumber(earningTokenPrice),
    stakingTokenPrice: _toNumber(earningTokenPrice),
    tokenPerSecond: rewardPerSecond,
    totalStaked: cakePoolInfo.total_amount,
  })

  return {
    sousId: cakeFarm.pid,
    contractAddress: {
      [chainId]: cakeFarm.lpAddress,
    },
    stakingToken: cakeFarm.token,
    earningToken: cakeFarm.token,
    apr,
    earningTokenPrice: _toNumber(earningTokenPrice),
    stakingTokenPrice: _toNumber(earningTokenPrice),

    isFinished: false,
    poolCategory: PoolCategory.CORE,
    startBlock: 0,
    tokenPerBlock: rewardPerSecond,
    stakingLimit: BIG_ZERO,
    totalStaked: new BigNumber(cakePoolInfo.total_amount),

    userData,

    profileRequirement: undefined,
  }
}
