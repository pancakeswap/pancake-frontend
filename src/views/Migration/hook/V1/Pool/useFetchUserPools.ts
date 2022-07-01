import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { SerializedPool } from 'state/types'
import { transformPool } from 'state/pools/helpers'
import { getCakeContract } from 'utils/contractHelpers'
import { CHAIN_ID } from 'config/constants/networks'
import { PoolCategory } from 'config/constants/types'
import { serializeTokens } from 'config/constants/tokens'
import { fetchUserStakeBalances, fetchUserPendingRewards } from './fetchPoolsUser'

export interface PoolsState {
  data: SerializedPool
  userDataLoaded: boolean
}

const serializedTokens = serializeTokens()
const cakeContract = getCakeContract()

const initialData = {
  data: {
    sousId: 0,
    stakingToken: serializedTokens.cake,
    earningToken: serializedTokens.cake,
    contractAddress: {
      97: '0x1d32c2945C8FDCBc7156c553B7cEa4325a17f4f9',
      56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '10',
    isFinished: false,
    totalStaked: '0',
  },
  userDataLoaded: false,
}

export const useFetchUserPools = (account) => {
  const [userPoolsData, setPoolsUserData] = useState<PoolsState>(initialData)

  const fetchUserPoolsData = useCallback(() => {
    if (account) {
      const fetchPoolsUserDataAsync = async () => {
        try {
          const [stakedBalances, pendingRewards, totalStaking] = await Promise.all([
            fetchUserStakeBalances(account),
            fetchUserPendingRewards(account),
            cakeContract.balanceOf(initialData.data.contractAddress[CHAIN_ID]),
          ])

          const userData = {
            sousId: initialData.data.sousId,
            allowance: '0',
            stakingTokenBalance: '0',
            stakedBalance: stakedBalances,
            pendingReward: pendingRewards,
          }

          setPoolsUserData((old) => ({
            data: {
              ...old.data,
              userData,
              totalStaked: new BigNumber(totalStaking.toString()).toJSON(),
            },
            userDataLoaded: true,
          }))
        } catch (error) {
          console.error('[Pools Action] Error fetching pool user data', error)
        }
      }

      fetchPoolsUserDataAsync()
    }
  }, [account])

  useFastRefreshEffect(() => {
    fetchUserPoolsData()
  }, [fetchUserPoolsData])

  return {
    data: transformPool(userPoolsData.data),
    userDataLoaded: userPoolsData.userDataLoaded,
    fetchUserPoolsData,
  }
}
