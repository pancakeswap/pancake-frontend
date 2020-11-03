/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'

import { unstake, sousUnstake, getMasterChefContract, getSousChefContract, sousEmegencyUnstake } from '../sushi/utils'

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

const SYRUPIDS = [5, 6, 3, 1]

export const useSousUnstake = (sousId) => {
  const { account } = useWallet()
  const sushi = useSushi()
  const sousChefContract = getSousChefContract(sushi, sousId)
  const masterChefContract = getMasterChefContract(sushi)
  const isOldSyrup = SYRUPIDS.includes(sousId)

  const handleUnstake = useCallback(
    async (amount: string) => {
      if(sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account)
        console.log(txHash)
      }
      else if(isOldSyrup) {
        const txHash = await sousEmegencyUnstake(sousChefContract, amount, account)
      }
      else {
        const txHash = await sousUnstake(sousChefContract, amount, account)
        console.log(txHash)
      }
    },
    [account, sushi, sousChefContract, isOldSyrup],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
