import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/actions'
// import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { depositJar  } from 'utils/callHelpers'
// import { useMasterchef, useSousChef } from './useContract'
import { useJar } from './useContract'

const useStake = (jarAddress: string) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const jarContract = useJar(jarAddress)

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await depositJar(jarContract, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, jarContract],
  )

  return { onStake: handleStake }
}


export default useStake
