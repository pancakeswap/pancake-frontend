import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import useSushi from './useSushi'

import { stake, sousStake, sousStakeBnb, getMasterChefContract, getSousChefContract } from '../sushi/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(getMasterChefContract(sushi), pid, amount, account)
      console.info(txHash)
    },
    [account, pid, sushi],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
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
    },
    [account, isUsingBnb, sousId, sushi],
  )

  return { onStake: handleStake }
}

export default useStake
