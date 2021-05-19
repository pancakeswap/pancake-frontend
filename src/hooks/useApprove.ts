import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
// import { ethers } from 'ethers'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/actions'
import { approve } from 'utils/callHelpers'
// import { useMasterchef, useCake, useSousChef, useLottery } from './useContract'
import { useJar } from './useContract'

// Approve a Farm
export const useApprove = (lpContract: Contract, jarContractAddress: string) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const jarContract = useJar(jarContractAddress)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, jarContract, account)
      dispatch(fetchFarmUserDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, jarContract])

  return { onApprove: handleApprove }
}

export default useApprove
