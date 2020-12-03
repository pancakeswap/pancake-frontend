import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useSushi from './useSushi'
import { getSushiContract, approve, getMasterChefContract, getSousChefContract } from '../sushi/utils'
import { getLotteryContract } from '../sushi/lotteryUtils'

const useApprove = (lpContract: Contract) => {
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

export const useSousApprove = (lpContract: Contract, sousId) => {
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, sousChefContract])

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
