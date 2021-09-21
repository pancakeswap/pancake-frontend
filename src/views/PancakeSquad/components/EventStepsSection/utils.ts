import { EventStatus, StepStatus } from '@pancakeswap/uikit'
import { SaleStatusEnum } from 'views/PancakeSquad/types'
import { getEventStepStatus, getEventStepStatusType } from 'views/PancakeSquad/utils'

type getStepperStatusType = getEventStepStatusType & { hasProfileActivated: boolean; isMintingFinished?: boolean }

const eventStatusMapping: Record<EventStatus, StepStatus> = {
  past: 'past',
  live: 'current',
  upcoming: 'future',
}

export const getStepperStatus = ({
  eventStatus,
  saleStatus: currentSaleStatus,
  hasProfileActivated,
  isMintingFinished,
}: getStepperStatusType): StepStatus => {
  if (!hasProfileActivated) return 'future'
  if (isMintingFinished && currentSaleStatus === SaleStatusEnum.Claim) return 'past'

  const status = getEventStepStatus({
    saleStatus: currentSaleStatus,
    eventStatus,
  })

  return eventStatusMapping[status]
}
