import { useCallback } from 'react'
import { useWallet } from 'use-wallet'

import useSushi from './useSushi'
import { buy, getLotteryContract, multiBuy } from '../sushi/lotteryUtils'

const useBuyLottery = () => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleBuy = useCallback(
    async (amount: string, numbers: Array<number>) => {
      try {
        const txHash = await buy(
          getLotteryContract(sushi),
          amount,
          numbers,
          account,
        )
        return txHash
      } catch(e) {
        return false
      }
    },
    [account, sushi],
  )

  return { onBuy: handleBuy }
}

export const useMultiBuyLottery = () => {
  const { account, ethereum }: { account: any, ethereum: any } = useWallet()

  const handleMultiBuy = useCallback(
    async (amount: string, numbers: Array<number>) => {
      console.log('0')
      if(ethereum) {
        console.log('1')
        const chainId = Number(ethereum.chainId)
        try {
          const txHash = await multiBuy(
            chainId,
            ethereum,
            numbers,
          )
          return txHash
        } catch(e) {
          return false
        }
      }
      return false
    },
    [ethereum],
  )

  return { onMultiBuy: handleMultiBuy }
}

export default useBuyLottery
