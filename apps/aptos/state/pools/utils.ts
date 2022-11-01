/* eslint-disable camelcase */
import { ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'
import { Pool } from '@pancakeswap/uikit'
import { HexString, TypeTagParser } from 'aptos'
import { PoolCategory } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import _get from 'lodash/get'
import { PoolResource } from './types'

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

      if (stakedData) {
        userData = {
          ...userData,
          pendingReward: new BigNumber(_get(stakedData, 'value.reward_debt')),
          stakedBalance: new BigNumber(_get(stakedData, 'value.amount')),
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
