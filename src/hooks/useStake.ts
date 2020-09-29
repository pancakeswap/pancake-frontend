import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'

import { stake, sousStake, getMasterChefContract, getSousChefContract } from '../sushi/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(
        getMasterChefContract(sushi),
        pid,
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, pid, sushi],
  )

  return { onStake: handleStake }
}

export const useSousStake = () => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await sousStake(
        getSousChefContract(sushi),
        amount,
        account,
      )
    },
    [account, sushi],
  )

  return { onStake: handleStake }
}

export default useStake
