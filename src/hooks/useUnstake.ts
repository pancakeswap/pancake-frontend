import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import {
  fetchFarmUserDataAsync
} from 'state/actions'
// import { unstake, sousUnstake, sousEmergencyUnstake } from 'utils/callHelpers'
import { unstake } from 'utils/callHelpers'
// import { useMasterchef, useSousChef } from './useContract'
import { useJar } from './useContract'

const useUnstake = (pid: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const jarContract = useJar('0x796E0e64F3980B859F2c801795F25e433459cBe3')

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(jarContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, jarContract, pid],
  )

  return { onUnstake: handleUnstake }
}


export default useUnstake
