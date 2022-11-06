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

import { PoolResource } from '../types'
import getSecondsLeftFromNow from '../utils/getSecondsLeftFromNow'

const transformPool = (resource: PoolResource, balances): Pool.DeserializedPool<Coin> => {
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

export default transformPool
