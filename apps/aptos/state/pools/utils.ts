/* eslint-disable camelcase */
import { Currency, Pair } from '@pancakeswap/aptos-swap-sdk'
import { createAccountResourceFilter, FetchAccountResourceResult } from '@pancakeswap/awgmi/core'
import { Types } from 'aptos'
import fromPairs from 'lodash/fromPairs'
import { POOLS_ADDRESS, POOLS_ADDRESS_MODULE, POOLS_ADDRESS_SYRUP_USER } from './constants'
import { Pool, PoolResource, PoolSyrupUserResource } from './types'

export const transformPool = (resource: PoolResource): Pool => {
  const [staking, earning] = Pair.parseType(resource.type)
  const now = Date.now()
  return {
    ...resource,
    stakingTokenAddress: staking,
    earningTokenAddress: earning,
    isFinished: now > +resource.data.bonus_end_timestamp,
  }
}

export const poolsUserDataSelector = (resources: FetchAccountResourceResult<any>[]) => {
  const allPairData = resources.filter(poolsUserDataFilter)
  return fromPairs(allPairData.map((p) => [p.type, p]))
}

const poolsUserDataFilter = createAccountResourceFilter<PoolSyrupUserResource>(POOLS_ADDRESS_SYRUP_USER)

export const poolsPublicDataSelector = createAccountResourceFilter<PoolResource>(`${POOLS_ADDRESS_MODULE}::Syrup<`)

export const getSyrupUserAddress = ({
  stakingTokenAddress,
  earningTokenAddress,
}: {
  stakingTokenAddress: string
  earningTokenAddress: string
}) => {
  return `${POOLS_ADDRESS_SYRUP_USER}<${stakingTokenAddress}, ${earningTokenAddress}>`
}

export const poolDepositPayload = (typeArgs: [string, string], args: [string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${POOLS_ADDRESS}::syrup::deposit`,
  }
}

export const poolWithdrawPayload = (typeArgs: [string, string], args: [string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${POOLS_ADDRESS}::syrup::withdraw`,
  }
}
