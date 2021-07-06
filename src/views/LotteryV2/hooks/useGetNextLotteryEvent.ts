import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useEffect, useState } from 'react'

interface LotteryEvent {
  nextEventTime: number
  postCountdownText?: string
  preCountdownText?: string
}

const useGetNextLotteryEvent = (endTime: number, status: LotteryStatus): LotteryEvent => {
  const { t } = useTranslation()
  const vrfRequestTime = 180 // 3 mins
  const secondsBetweenRounds = 300 // 5 mins
  const transactionResolvingBuffer = 30 // Delay countdown by 30s to ensure contract transactions have been calculated and broadcast
  const [nextEvent, setNextEvent] = useState({ nextEventTime: null, preCountdownText: null, postCountdownText: null })

  useEffect(() => {
    // Current lottery is active
    if (status === LotteryStatus.OPEN) {
      setNextEvent({
        nextEventTime: endTime + transactionResolvingBuffer,
        preCountdownText: null,
        postCountdownText: t('until the draw'),
      })
    }
    // Current lottery has finished but not yet claimable
    if (status === LotteryStatus.CLOSE) {
      setNextEvent({
        nextEventTime: endTime + transactionResolvingBuffer + vrfRequestTime,
        preCountdownText: t('Winners announced in'),
        postCountdownText: null,
      })
    }
    // Current lottery claimable. Next lottery has not yet started
    if (status === LotteryStatus.CLAIMABLE) {
      setNextEvent({
        nextEventTime: endTime + transactionResolvingBuffer + secondsBetweenRounds,
        preCountdownText: t('Tickets on sale in'),
        postCountdownText: null,
      })
    }
  }, [status, endTime, t])

  return nextEvent
}

export default useGetNextLotteryEvent
