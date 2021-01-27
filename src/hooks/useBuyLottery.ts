import { useCallback, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useLottery, useLotteryTicket } from 'hooks/useContract'
import { multiClaim, getMax, multiBuy } from '../utils/lotteryUtils'

export const useMultiClaimLottery = () => {
  const { account } = useWeb3React()
  const lotteryContract = useLottery()
  const lotteryTicketContract = useLotteryTicket()

  const handleClaim = useCallback(async () => {
    try {
      const txHash = await multiClaim(lotteryContract, lotteryTicketContract, account)
      return txHash
    } catch (e) {
      return false
    }
  }, [account, lotteryContract, lotteryTicketContract])

  return { onMultiClaim: handleClaim }
}

export const useMultiBuyLottery = () => {
  const { account } = useWeb3React()
  const lotteryContract = useLottery()

  const handleBuy = useCallback(
    async (amount: string, numbers: Array<any>) => {
      try {
        const txHash = await multiBuy(lotteryContract, amount, numbers, account)
        return txHash
      } catch (e) {
        return false
      }
    },
    [account, lotteryContract],
  )

  return { onMultiBuy: handleBuy }
}

export const useMaxNumber = () => {
  const [max, setMax] = useState(5)
  const lotteryContract = useLottery()

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
