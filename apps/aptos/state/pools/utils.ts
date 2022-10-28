/* eslint-disable camelcase */
import { Pair } from '@pancakeswap/aptos-swap-sdk'
import { createAccountResourceFilter, FetchAccountResourceResult } from '@pancakeswap/awgmi/core'
import fromPairs from 'lodash/fromPairs'
import { POOLS_ADDRESS, POOLS_ADDRESS_SYRUP_USER, POOLS_MODULE_NAME, POOLS_NAME } from './constants'
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

export const poolsPublicDataSelector = createAccountResourceFilter<PoolResource>({
  address: POOLS_ADDRESS,
  moduleName: POOLS_MODULE_NAME,
  name: POOLS_NAME,
})

export const getSyrupUserAddress = ({
  stakingTokenAddress,
  earningTokenAddress,
}: {
  stakingTokenAddress: string
  earningTokenAddress: string
}) => {
  return `${POOLS_ADDRESS_SYRUP_USER}<${stakingTokenAddress}, ${earningTokenAddress}>`
}
