/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'

import { unstake, sousUnstake, getMasterChefContract, getSousChefContract } from '../sushi/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      console.log(txHash)
    },
    [account, pid, sushi],
  )

  return { onUnstake: handleUnstake }
}

export const useSousUnstake = (sousId) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await sousUnstake(sousChefContract, amount, account)
      console.log(txHash)
    },
    [account, sushi, sousChefContract],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
