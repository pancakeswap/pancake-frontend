import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/actions'
// import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { stake  } from 'utils/callHelpers'
// import { useMasterchef, useSousChef } from './useContract'
import { useJar } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const jarContract = useJar('0x796E0e64F3980B859F2c801795F25e433459cBe3')

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(jarContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, jarContract, pid],
  )

  return { onStake: handleStake }
}


export default useStake
