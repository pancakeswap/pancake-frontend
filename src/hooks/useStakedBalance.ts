import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStaked, getMasterChefContract, getSousChefContract, getSousStaked, getTotalStaked } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(masterChefContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, pid, sushi])

  useEffect(() => {
    if (account && sushi) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, sushi])

  return balance
}

export const useSousStakedBalance = (sousId) =>{
   const [balance, setBalance] = useState(new BigNumber(0))
   const { account }: { account: string } = useWallet()
   const sushi = useSushi()
   const sousChefContract = getSousChefContract(sushi, sousId)
   const block = useBlock()

   const fetchBalance = useCallback(async () => {
     const balance = await getSousStaked(sousChefContract, account)
     setBalance(new BigNumber(balance))
   }, [account, sushi, sousChefContract])

   useEffect(() => {
     if (account && sushi) {
       fetchBalance()
     }
   }, [account, setBalance, block, sushi])

   return balance
}

export const useSousTotalStaked = (sousId) =>{
   const [balance, setBalance] = useState(new BigNumber(0))
   const { account }: { account: string } = useWallet()
   const sushi = useSushi()
   const sousChefContract = getSousChefContract(sushi, sousId)
   const block = useBlock()

   const fetchBalance = useCallback(async () => {
     const balance = await getTotalStaked(sushi, sousChefContract)
     setBalance(new BigNumber(balance))
   }, [account, sushi, sousChefContract])

   useEffect(() => {
     if (account && sushi) {
       fetchBalance()
     }
   }, [account, setBalance, block, sushi])

   return balance
}

export default useStakedBalance
