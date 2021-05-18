import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/actions'
// import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { stake  } from 'utils/callHelpers'
// import { useMasterchef, useSousChef } from './useContract'
import { useMasterchef } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}


export default useStake
