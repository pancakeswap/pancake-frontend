import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import {
  fetchFarmUserDataAsync
} from 'state/actions'
// import { unstake, sousUnstake, sousEmergencyUnstake } from 'utils/callHelpers'
import { unstake } from 'utils/callHelpers'
// import { useMasterchef, useSousChef } from './useContract'
import { useMasterchef } from './useContract'

const useUnstake = (pid: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onUnstake: handleUnstake }
}


export default useUnstake
