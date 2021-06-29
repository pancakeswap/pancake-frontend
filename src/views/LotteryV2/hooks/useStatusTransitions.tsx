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
    // Only run if there is a status state difference
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
      // Current lottery is CLAIMABLE and the timer has reached zero - fetch next lottery.
      if (previousStatus === LotteryStatus.CLAIMABLE && isTransitioning) {
        console.log('|| TRANSITIONING && CLAIMABLE')
        dispatch(fetchPublicLotteryData())
      }
    }
  }, [currentLotteryId, status, previousStatus, isTransitioning, dispatch])
}

export default useStatusTransitions
