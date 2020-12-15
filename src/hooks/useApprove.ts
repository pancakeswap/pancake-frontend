import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { useDispatch } from 'react-redux'
import { updateUserAllowance, fetchFarmUserDataAsync } from 'state/actions'
import { getSushiContract, approve, getMasterChefContract, getSousChefContract } from 'sushi/utils'
import { getLotteryContract } from 'sushi/lotteryUtils'
import useSushi from './useSushi'

const useApprove = (lpContract: Contract, pid: number) => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      dispatch(fetchFarmUserDataAsync(pid, account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, masterChefContract, pid])

  return { onApprove: handleApprove }
}

export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch()
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account)
      dispatch(updateUserAllowance(sousId, account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId])

  return { onApprove: handleApprove }
}

export const useLotteryApprove = () => {
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)
  const cakeContract = getSushiContract(sushi)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, lotteryContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, cakeContract, lotteryContract])

  return { onApprove: handleApprove }
}

export default useApprove
