import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import {
  fetchFarmUserDataAsync
} from 'state/actions'
// import { unstake, sousUnstake, sousEmergencyUnstake } from 'utils/callHelpers'
import { withdrawalJar } from 'utils/callHelpers'
// import { useMasterchef, useSousChef } from './useContract'
import { useJar } from './useContract'

const useUnstake = (jarAddress: string) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const jarContract = useJar(jarAddress)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await withdrawalJar(jarContract, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, jarContract],
  )

  return { onUnstake: handleUnstake }
}


export default useUnstake
