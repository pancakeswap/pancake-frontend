/* eslint-disable camelcase */
import { Coin, Pair, Currency } from '@pancakeswap/aptos-swap-sdk'
import { fetchCoin } from '@pancakeswap/awgmi/core'
import fromPairs from 'lodash/fromPairs'
import { Types } from 'aptos'
import { PoolResource, Pool } from './types'
import { POOLS_ADDRESS, POOLS_ADDRESS_SYRUP_USER } from './constants'

const transformPool = async (resource: PoolResource, chainId: number): Promise<Pool> => {
  const [staking, earning] = Pair.parseType(resource.type)
  const [stakingToken, earningToken] = await Promise.all([fetchCoin({ coin: staking }), fetchCoin({ coin: earning })])
  const now = Date.now()
  return {
    ...resource,
    stakingToken: new Coin(
      chainId,
      stakingToken.address,
      stakingToken.decimals,
      stakingToken.symbol,
      stakingToken.name,
    ),
    earningToken: new Coin(
      chainId,
      earningToken.address,
      earningToken.decimals,
      earningToken.symbol,
      earningToken.name,
    ),
    isFinished: now > +resource.data.bonus_end_timestamp,
  }
}

export const transformPools = async (resources: PoolResource[], chainId: number): Promise<Pool[]> => {
  const pools: Promise<Pool>[] = []

  for (const resource of resources) {
    // Bad: each loop iteration is delayed until the entire asynchronous operation completes
    const x = transformPool(resource, chainId)
    pools.push(x)
  }

  const result = await Promise.all(pools)
  return result
}

export const poolsUserDataSelector = (resources) => {
  const allPairData = resources.filter((r) => r.type.includes(POOLS_ADDRESS_SYRUP_USER))
  return fromPairs(allPairData.map((p) => [p.type, p]))
}

export const getSyrupUserAddress = (stakingToken: Currency, earningToken: Currency) => {
  return `${POOLS_ADDRESS_SYRUP_USER}<${stakingToken.address}, ${earningToken.address}>`
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
