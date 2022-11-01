import { useAccountResources } from '@pancakeswap/awgmi'
import { Coin, SMARTCHEF_ADDRESS, SMARTCHEF_SYRUP_POOL_TYPE_TAG } from '@pancakeswap/aptos-swap-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import _get from 'lodash/get'
import BigNumber from 'bignumber.js'
import { Pool } from '@pancakeswap/uikit'

import { transformPool } from './utils'

export const usePoolsList = () => {
  const { account } = useActiveWeb3React()

  const { data: pools } = useAccountResources({
    address: SMARTCHEF_ADDRESS,
    select: (resources) => {
      return resources
        .filter((resource) => resource.type.includes(SMARTCHEF_SYRUP_POOL_TYPE_TAG))
        .map(transformPool(account))
    },
    watch: true,
  })

  const { data: balances } = useAccountResources({
    address: account,
    select: (resources) => {
      return resources
    },
  })

  if (!pools) return []

  let derivedPools: Pool.DeserializedPool<Coin>[] = pools

  if (balances?.length) {
    derivedPools = derivedPools.map((pool) => {
      const foundStakingBalance = balances.find(
        (balance) => balance.type === `0x1::coin::CoinStore<${pool.stakingToken.address}>`,
      )
      const amount = _get(foundStakingBalance, 'data.coin.value')

      if (amount) {
        return { ...pool, userData: { ...pool.userData, stakingTokenBalance: new BigNumber(amount) } }
      }

      return pool
    })
  }

  return derivedPools
}
