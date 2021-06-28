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
  const blockBuffer = 3 // Delay countdown by 3s to ensure contract transactions have resolved when countdown finishes
  const [nextEvent, setNextEvent] = useState({ nextEventTime: null, preCountdownText: null, postCountdownText: null })

  useEffect(() => {
    // Current lottery is active
    if (status === LotteryStatus.OPEN) {
      setNextEvent({
        nextEventTime: endTime + blockBuffer,
        preCountdownText: null,
        postCountdownText: t('until the draw'),
      })
    }
    // Current lottery has finished but not yet claimable
    if (status === LotteryStatus.CLOSE) {
      setNextEvent({
        nextEventTime: endTime + blockBuffer + vrfRequestTime,
        preCountdownText: t('Winners announced in'),
        postCountdownText: null,
      })
    }
    // Current lottery claimable. Next lottery has not yet started
    if (status === LotteryStatus.CLAIMABLE) {
      setNextEvent({
        nextEventTime: endTime + blockBuffer + secondsBetweenRounds,
        preCountdownText: t('Tickets on sale in'),
        postCountdownText: null,
      })
    }
  }, [status, endTime, t])

  return nextEvent
}

export default useGetNextLotteryEvent
