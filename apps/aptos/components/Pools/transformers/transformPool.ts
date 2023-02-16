/* eslint-disable camelcase */
import { AptosCoin, Coin } from '@pancakeswap/aptos-swap-sdk'
import { Pool } from '@pancakeswap/uikit'
import { PoolCategory } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import _get from 'lodash/get'
import { FixedNumber } from '@ethersproject/bignumber'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import { PoolResource } from '../types'
import getSecondsLeftFromNow from '../utils/getSecondsLeftFromNow'
import splitTypeTag from '../../../utils/splitTypeTag'
import getTokenByAddress from '../utils/getTokenByAddress'
import { getPoolApr } from './transformCakePool'

function calcPendingRewardToken({
  currentTimestamp,
  lastRewardTimestamp,
  totalStakedToken,
  userStakedAmount,
  rewardPerSecond,
  currentRewardDebt,
  tokenPerShare,
  precisionFactor,
  endTime,
  isFinished,
}): FixedNumber {
  const pendingSeconds = Math.max(
    isFinished ? endTime - lastRewardTimestamp : getSecondsLeftFromNow(lastRewardTimestamp, currentTimestamp),
    0,
  )

  if (pendingSeconds === 0) {
    return FixedNumber.from(0)
  }

  const multiplier = FixedNumber.from(pendingSeconds)

  const rewardPendingToken = FixedNumber.from(rewardPerSecond).mulUnsafe(multiplier)

  const totalStake = FixedNumber.from(totalStakedToken)

  const precision = FixedNumber.from(precisionFactor)

  const latestTokenPerShare = FixedNumber.from(tokenPerShare).addUnsafe(
    rewardPendingToken.mulUnsafe(precision).divUnsafe(totalStake),
  )

  const rewardDebt = FixedNumber.from(currentRewardDebt)

  const pendingReward = FixedNumber.from(userStakedAmount)
    .mulUnsafe(latestTokenPerShare)
    .divUnsafe(precision)
    .subUnsafe(rewardDebt)

  return pendingReward
}

const transformPool = (
  resource: PoolResource,
  currentTimestamp,
  balances,
  chainId,
  prices,
  sousId,
):
  | (Pool.DeserializedPool<Coin | AptosCoin> & {
      stakeLimitEndBlock?: number
    })
  | undefined => {
  const startTime = _toNumber(_get(resource, 'data.start_timestamp', '0'))

  const startYet = getSecondsLeftFromNow(startTime, currentTimestamp)

  if (!startYet) return undefined

  const endTime = _toNumber(_get(resource, 'data.end_timestamp', '0'))

  const hasRewardToken = _toNumber(_get(resource, 'data.total_reward_token.value', '0'))

  const isFinished = getSecondsLeftFromNow(endTime, currentTimestamp) || !hasRewardToken

  const [stakingAddress, earningAddress] = splitTypeTag(resource.type)

  let userData = {
    allowance: BIG_ZERO,
    pendingReward: BIG_ZERO,
    stakedBalance: BIG_ZERO,
    stakingTokenBalance: BIG_ZERO,
  }

  const totalStakedToken = _get(resource, 'data.total_staked_token.value', '0')
  const rewardPerSecond = _get(resource, 'data.reward_per_second')

  if (balances?.length) {
    const stakingTokenBalance = balances.find((balance) => balance.type === `0x1::coin::CoinStore<${stakingAddress}>`)
    const amount = _get(stakingTokenBalance, 'data.coin.value')
    if (amount) {
      userData = { ...userData, stakingTokenBalance: new BigNumber(amount) }
    }

    const resourceTypes = resource.type
    const foundStakedPoolBalance = balances.find(
      (balance) => balance.type === resourceTypes.replace('PoolInfo', 'UserInfo'),
    )

    if (foundStakedPoolBalance) {
      const userStakedAmount = _toNumber(_get(foundStakedPoolBalance, 'data.amount', '0'))

      if (userStakedAmount && _toNumber(totalStakedToken)) {
        const currentRewardDebt = _get(foundStakedPoolBalance, 'data.reward_debt')
        const lastRewardTimestamp = _toNumber(_get(resource, 'data.last_reward_timestamp'))
        const tokenPerShare = _get(resource, 'data.acc_token_per_share')
        const precisionFactor = _get(resource, 'data.precision_factor')

        const pendingReward = calcPendingRewardToken({
          currentTimestamp,
          currentRewardDebt,
          lastRewardTimestamp,
          totalStakedToken,
          userStakedAmount,
          rewardPerSecond,
          tokenPerShare,
          precisionFactor,
          endTime,
          isFinished,
        }).toString()

        userData = {
          ...userData,
          pendingReward: new BigNumber(pendingReward),
          stakedBalance: new BigNumber(userStakedAmount),
        }
      }
    }
  }

  const stakingToken = getTokenByAddress({ chainId, address: stakingAddress })
  const earningToken = getTokenByAddress({ chainId, address: earningAddress })

  if (!stakingToken || !earningToken) return undefined

  const earningTokenPrice = prices[earningAddress] || 0
  const stakingTokenPrice = prices[stakingAddress] || 0

  const apr =
    getPoolApr({
      rewardTokenPrice: _toNumber(earningTokenPrice),
      stakingTokenPrice: _toNumber(stakingTokenPrice),
      tokenPerSecond: getBalanceNumber(new BigNumber(rewardPerSecond), earningToken.decimals),
      totalStaked: getBalanceNumber(new BigNumber(totalStakedToken), stakingToken.decimals),
    }) || 0

  const startBlock = _toNumber(resource.data.start_timestamp)

  const stakeLimitEndBlock = _toNumber(resource.data.seconds_for_user_limit)

  const stakeLimitTimeRemaining = stakeLimitEndBlock + startBlock - currentTimestamp / 1000

  return {
    sousId,
    contractAddress: {
      [chainId]: resource.type,
    },
    stakingToken,
    earningToken,
    apr,
    earningTokenPrice,
    stakingTokenPrice,

    isFinished: Boolean(isFinished),
    poolCategory: PoolCategory.CORE,
    startBlock,
    endBlock: _toNumber(resource.data.end_timestamp),

    tokenPerBlock: resource.data.reward_per_second,
    stakingLimit:
      stakeLimitTimeRemaining > 0 && resource.data.pool_limit_per_user
        ? new BigNumber(resource.data.pool_limit_per_user)
        : BIG_ZERO,
    stakeLimitEndBlock: _toNumber(resource.data.seconds_for_user_limit),
    totalStaked: new BigNumber(totalStakedToken),

    userData,

    profileRequirement: undefined,
  }
}

export default transformPool
