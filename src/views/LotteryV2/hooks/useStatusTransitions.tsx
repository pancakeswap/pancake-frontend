import { LotteryStatus } from 'config/constants/types'
import usePreviousValue from 'hooks/usePreviousValue'
import { useEffect } from 'react'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/hooks'
import { fetchCurrentLottery, fetchPastLotteries, fetchPublicLotteryData } from 'state/lottery'

const useStatusTransitions = () => {
  const {
    currentLotteryId,
    isTransitioning,
    currentRound: { status },
  } = useLottery()

  const dispatch = useAppDispatch()
  const previousStatus = usePreviousValue(status)

  useEffect(() => {
    // Only run if there is a status state change
    if (previousStatus !== status) {
      console.log('|| STATUS CHANGE')
      // Previous lottery to new lottery transition. From CLAIMABLE > OPEN
      if (previousStatus === LotteryStatus.CLAIMABLE && status === LotteryStatus.OPEN) {
        console.log('|| CLAIMABLE > OPEN')
        dispatch(fetchCurrentLottery({ currentLotteryId }))
        dispatch(fetchPastLotteries())
      }
      // Current lottery transitions from OPEN > CLOSE
      if (previousStatus === LotteryStatus.OPEN && status === LotteryStatus.CLOSE) {
        console.log('|| OPEN > CLOSE')
        dispatch(fetchCurrentLottery({ currentLotteryId }))
      }
      // Current lottery transitions from CLOSE > CLAIMABLE
      if (previousStatus === LotteryStatus.CLOSE && status === LotteryStatus.CLAIMABLE) {
        console.log('|| CLOSE > CLAIMABLE')
        dispatch(fetchCurrentLottery({ currentLotteryId }))
      }
    }
  }, [currentLotteryId, status, previousStatus, dispatch])

  useEffect(() => {
    // Current lottery is CLAIMABLE and the round is transitioning - fetch current lottery ID every 10s.
    // This condition will no longer be true when fetchPublicLotteryData returns the next lottery ID
    if (previousStatus === LotteryStatus.CLAIMABLE && status === LotteryStatus.CLAIMABLE && isTransitioning) {
      console.log('|| TRANSITIONING && CLAIMABLE - FIRST FETCH')
      dispatch(fetchPublicLotteryData())
      const interval = setInterval(async () => {
        console.log('|| FETCHING NEW LOTTERY ROUND')
        dispatch(fetchPublicLotteryData())
      }, 10000)
      return () => clearInterval(interval)
    }
    return () => null
  }, [status, previousStatus, isTransitioning, dispatch])
}

export default useStatusTransitions
