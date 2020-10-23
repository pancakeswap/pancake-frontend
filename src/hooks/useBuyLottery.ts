import { useCallback,useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'

import useSushi from './useSushi'
import { buy, getLotteryContract, getTicketsContract, multiClaim, getMax, multiBuy } from '../sushi/lotteryUtils'

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

export const useMultiClaimLottery = () => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleClaim = useCallback(
    async () => {
      try {
        const txHash = await multiClaim(
          sushi,
          getLotteryContract(sushi),
          getTicketsContract(sushi),
          account,
        )
        return txHash
      } catch(e) {
        return false
      }
    },
    [account, sushi],
  )

  return { onMultiClaim: handleClaim }
}

export const useMultiBuyLottery = () => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleBuy = useCallback(
    async (amount: string, numbers: Array<any>) => {
      try {
        const txHash = await multiBuy(
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

  return { onMultiBuy: handleBuy }
}

export const useMaxNumber = () => {
  const [max, setMax] = useState(5)
  const sushi = useSushi()
  const lotteryContract = getLotteryContract(sushi)

  const fetchMax = useCallback(async () => {
    const maxNumber = await getMax(lotteryContract)
    setMax(maxNumber)
  }, [lotteryContract])

  useEffect(() => {
    if (lotteryContract &&  sushi) {
      fetchMax()
    }
  }, [lotteryContract, sushi])

  return max
}


export default useBuyLottery
