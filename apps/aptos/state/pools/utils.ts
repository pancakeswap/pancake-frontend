/* eslint-disable camelcase */
import { FixedNumber } from '@ethersproject/bignumber'

import { ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'
import { Pool } from '@pancakeswap/uikit'
import { HexString, TypeTagParser } from 'aptos'
import { PoolCategory } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import _get from 'lodash/get'
import { PoolResource } from './types'

const SECONDS_IN_YEAR = 31536000 // 365 * 24 * 60 *60

const getSecondsLeftFromNow = (timestamp: number) => {
  const now = Math.floor(Date.now() / 1000)

  return Number.isFinite(timestamp) && timestamp < now ? now - timestamp : 0
}

// In order to calculate, I need tokenPrice from farms
export const getPoolApr = ({ rewardTokenPrice, stakingTokenPrice, tokenPerSecond, totalStaked }) => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerSecond).times(SECONDS_IN_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

export const transformPool =
  (account) =>
  (resource: PoolResource): Pool.DeserializedPool<Coin> => {
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

    const now = Date.now()

    let userData = {
      allowance: new BigNumber(0),
      pendingReward: new BigNumber(0),
      stakedBalance: new BigNumber(0),
      stakingTokenBalance: new BigNumber(0),
    }

    if (account) {
      const stakedData = _get(resource, 'data.user_infos.data', []).find((user) => _get(user, 'key') === account)

      const stakedAmount = _get(stakedData, 'value.amount')

      if (stakedData && stakedAmount) {
        const userAmount = FixedNumber.from(stakedAmount)

        const lastRewardTimestamp = _toNumber(_get(resource, 'data.last_reward_timestamp'))

        // let multiplier = get_multiplier(pool_info.last_reward_timestamp, timestamp::now_seconds(), pool_info.end_timestamp);
        const multiplier = FixedNumber.from(getSecondsLeftFromNow(lastRewardTimestamp))

        const rewardPerSecond = FixedNumber.from(_get(resource, 'data.reward_per_second'))

        const rewardPendingToken = rewardPerSecond.mulUnsafe(multiplier)

        const tokenPerShare = FixedNumber.from(_get(resource, 'data.acc_token_per_share'))
        const precisionFactor = FixedNumber.from(_get(resource, 'data.precision_factor'))
        const totalStake = FixedNumber.from(_get(resource, 'data.total_staked_token.value'))

        const latestTokenPerShare = tokenPerShare.addUnsafe(
          rewardPendingToken.mulUnsafe(precisionFactor).divUnsafe(totalStake),
        )

        const rewardDebt = FixedNumber.from(_get(stakedData, 'value.reward_debt'))

        const pendingReward = userAmount.mulUnsafe(latestTokenPerShare).divUnsafe(precisionFactor).subUnsafe(rewardDebt)

        userData = {
          ...userData,
          pendingReward: new BigNumber(pendingReward.toString()),
          stakedBalance: new BigNumber(userAmount.toString()),
        }
      }
    }

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
      totalStaked: new BigNumber(0),

      userData,

      profileRequirement: undefined,
    }
  }
