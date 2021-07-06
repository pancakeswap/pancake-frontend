import { useState, useEffect } from 'react'
import { fetchCurrentLotteryIdAndMaxBuy, fetchLottery } from 'state/lottery/helpers'
import useRefresh from 'hooks/useRefresh'

const useFetchLotteryForPromos = () => {
  const { slowRefresh } = useRefresh()
  const [lotteryId, setLotteryId] = useState<string>(null)
  const [currentLotteryPrize, setCurrentLotteryPrize] = useState<string>(null)

  useEffect(() => {
    // get current lottery ID
    const fetchCurrentID = async () => {
      const { currentLotteryId } = await fetchCurrentLotteryIdAndMaxBuy()
      setLotteryId(currentLotteryId)
    }

    fetchCurrentID()
  }, [setLotteryId])

  useEffect(() => {
    // get public data for current lottery
    const fetchCurrentLotteryPrize = async () => {
      const { amountCollectedInCake } = await fetchLottery(lotteryId)
      setCurrentLotteryPrize(amountCollectedInCake)
    }

    if (lotteryId) {
      fetchCurrentLotteryPrize()
    }
  }, [lotteryId, slowRefresh, setCurrentLotteryPrize])

  return { currentLotteryPrize }
}

export default useFetchLotteryForPromos
