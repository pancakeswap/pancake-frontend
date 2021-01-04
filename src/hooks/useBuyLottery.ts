import { useCallback, useState, useEffect } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getLotteryContract, getTicketsContract, multiClaim, getMax, multiBuy } from '../sushi/lotteryUtils'

export const useMultiClaimLottery = () => {
  const { account } = useWallet()

  const handleClaim = useCallback(async () => {
    try {
      const txHash = await multiClaim(getLotteryContract(), getTicketsContract(), account)
      return txHash
    } catch (e) {
      return false
    }
  }, [account])

  return { onMultiClaim: handleClaim }
}

export const useMultiBuyLottery = () => {
  const { account } = useWallet()

  const handleBuy = useCallback(
    async (amount: string, numbers: Array<any>) => {
      try {
        const txHash = await multiBuy(getLotteryContract(), amount, numbers, account)
        return txHash
      } catch (e) {
        return false
      }
    },
    [account],
  )

  return { onMultiBuy: handleBuy }
}

export const useMaxNumber = () => {
  const [max, setMax] = useState(5)
  const lotteryContract = getLotteryContract()

  const fetchMax = useCallback(async () => {
    const maxNumber = await getMax(lotteryContract)
    setMax(maxNumber)
  }, [lotteryContract])

  useEffect(() => {
    if (lotteryContract) {
      fetchMax()
    }
  }, [lotteryContract, fetchMax])

  return max
}
