import { useCallback } from 'react'
import { useWallet } from 'use-wallet'

import useSushi from './useSushi'
import { buy, getLotteryContract } from '../sushi/lotteryUtils'

const useBuyLottery = () => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleBuy = useCallback(
    async (amount: string, numbers: Array<number>) => {
      const txHash = await buy(
        getLotteryContract(sushi),
        amount,
        numbers,
        account,
      )
      console.log(txHash)
    },
    [account, sushi],
  )

  return { onBuy: handleBuy }
}

export default useBuyLottery
