import { useCallback } from 'react'
import { useWallet } from 'use-wallet'

import useSushi from './useSushi'
import { buy, getLotteryContract } from '../sushi/lotteryUtils'

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

export default useBuyLottery
