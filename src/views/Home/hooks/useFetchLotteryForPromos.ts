import { useState, useEffect } from 'react'
import { fetchCurrentLotteryIdAndMaxBuy, fetchLottery } from 'state/lottery/helpers'
import useRefresh from 'hooks/useRefresh'
import useIntersectionObserver from 'hooks/useIntersectionObserver'

const useFetchLotteryForPromos = () => {
  const { slowRefresh } = useRefresh()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const [lotteryId, setLotteryId] = useState<string>(null)
  const [currentLotteryPrize, setCurrentLotteryPrize] = useState<string>(null)

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  useEffect(() => {
    // get current lottery ID
    const fetchCurrentID = async () => {
      const { currentLotteryId } = await fetchCurrentLotteryIdAndMaxBuy()
      setLotteryId(currentLotteryId)
    }

    if (loadData) {
      fetchCurrentID()
    }
  }, [setLotteryId, loadData])

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

  return { currentLotteryPrize, observerRef }
}

export default useFetchLotteryForPromos
