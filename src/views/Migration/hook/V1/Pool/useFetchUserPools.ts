import { useState } from 'react'
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

export const useFetchUserPools = (account) => {
  const [userPoolsData, setPoolsUserData] = useState<PoolsState>({
    data: {
      sousId: 0,
      stakingToken: serializedTokens.cake,
      earningToken: serializedTokens.cake,
      contractAddress: {
        97: '0x1d32c2945C8FDCBc7156c553B7cEa4325a17f4f9',
        // 56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
        56: '0x2782030FaaEc9F6DaC96cDA9c1dF3125A015078D',
      },
      poolCategory: PoolCategory.CORE,
      harvest: true,
      tokenPerBlock: '10',
      sortOrder: 1,
      isFinished: false,
      totalStaked: '0',
    },
    userDataLoaded: false,
  })

  useFastRefreshEffect(() => {
    fetchUserPoolsData()
  })

  const fetchUserPoolsData = () => {
    if (account) {
      const fetchPoolsUserDataAsync = async () => {
        try {
          const [stakedBalances, pendingRewards, totalStaking] = await Promise.all([
            fetchUserStakeBalances(account),
            fetchUserPendingRewards(account),
            cakeContract.balanceOf(userPoolsData.data.contractAddress[CHAIN_ID]),
          ])

          const userData = {
            sousId: userPoolsData.data.sousId,
            allowance: '0',
            stakingTokenBalance: '0',
            stakedBalance: stakedBalances,
            pendingReward: pendingRewards,
          }

          setPoolsUserData({
            data: {
              ...userPoolsData.data,
              userData,
              totalStaked: new BigNumber(totalStaking.toString()).toJSON(),
            },
            userDataLoaded: true,
          })
        } catch (error) {
          console.error('[Pools Action] Error fetching pool user data', error)
        }
      }

      fetchPoolsUserDataAsync()
    }
  }

  return {
    data: transformPool(userPoolsData.data),
    userDataLoaded: userPoolsData.userDataLoaded,
    fetchUserPoolsData,
  }
}
