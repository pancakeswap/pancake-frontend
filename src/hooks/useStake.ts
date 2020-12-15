import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb, getMasterChefContract, getSousChefContract } from 'sushi/utils'
import useSushi from './useSushi'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const sushi = useSushi()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(getMasterChefContract(sushi), pid, amount, account)
      dispatch(fetchFarmUserDataAsync(pid, account))
      console.info(txHash)
    },
    [account, dispatch, pid, sushi],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const sushi = useSushi()

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await stake(getMasterChefContract(sushi), 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(getSousChefContract(sushi, sousId), amount, account)
      } else {
        await sousStake(getSousChefContract(sushi, sousId), amount, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, sousId, sushi],
  )

  return { onStake: handleStake }
}

export default useStake
