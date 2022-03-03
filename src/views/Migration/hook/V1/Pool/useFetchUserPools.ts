import { useState } from 'react'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from 'state/pools/fetchPoolsUser'
import poolsConfig from '../../../poolsConfig'
import { SerializedPool } from 'state/types'
import { transformPool } from 'state/pools/helpers'

export interface PoolsState {
  data: SerializedPool[]
  userDataLoaded: boolean
}

export const useFetchUserPools = (account) => {
  const [userPoolsData, setPoolsUserData] = useState<PoolsState>({
    data: [...poolsConfig],
    userDataLoaded: false,
  })

  useFastRefreshEffect(() => {
    if (account) {
      const fetchPoolsUserDataAsync = async (account: string) => {
        try {
          const allowances = await fetchPoolsAllowance(account)
          const stakingTokenBalances = await fetchUserBalances(account)
          const stakedBalances = await fetchUserStakeBalances(account)
          const pendingRewards = await fetchUserPendingRewards(account)

          const userData = poolsConfig.map((pool) => ({
            sousId: pool.sousId,
            allowance: allowances[pool.sousId],
            stakingTokenBalance: stakingTokenBalances[pool.sousId],
            stakedBalance: stakedBalances[pool.sousId],
            pendingReward: pendingRewards[pool.sousId],
          }))

          setPoolsUserData({
            data: userPoolsData.data.map((pool) => {
              const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
              return { ...pool, userData: userPoolData }
            }),
            userDataLoaded: true,
          })
        } catch (error) {
          console.error('[Pools Action] Error fetching pool user data', error)
        }
      }

      fetchPoolsUserDataAsync(account)
    }
  }, [account])

  return {
    data: userPoolsData.data.map(transformPool),
    userDataLoaded: userPoolsData.userDataLoaded,
  }
}
