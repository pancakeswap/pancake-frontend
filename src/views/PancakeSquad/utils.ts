import { EventStatus } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import formatTimePeriod from 'utils/formatTimePeriod'
import getTimePeriods from 'utils/getTimePeriods'
import { SaleStatusEnum, UserStatusEnum } from './types'

type getUserStatusType = {
  account?: string
  hasGen0: boolean | null
  hasActiveProfile: boolean
}

export type getEventStepStatusType = {
  eventStatus: SaleStatusEnum[]
  saleStatus: SaleStatusEnum
  startTimestamp?: number
}

type getEventTextType = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  eventStatus: SaleStatusEnum[]
  startTimestamp?: number
}

type getTimePeriodFromTimeStampType = {
  startTimestamp?: number
  timestampOffsetInSeconds?: number
}

type getAltTextType = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  eventStatus: SaleStatusEnum[]
  startTimestamp?: number
}

const FIFTEEN_MINUTES = 60 * 15
const PRESALE_TIMESTAMP = 1633579200000

export const getUserStatus = ({ account, hasActiveProfile, hasGen0 }: getUserStatusType): UserStatusEnum => {
  if (account && hasActiveProfile && hasGen0) {
    return UserStatusEnum.PROFILE_ACTIVE_GEN0
  }
  if (account && hasActiveProfile) {
    return UserStatusEnum.PROFILE_ACTIVE
  }
  if (account) {
    return UserStatusEnum.NO_PROFILE
  }
  return UserStatusEnum.UNCONNECTED
}

const eventTextMapping = (t: ContextApi['t'], saleStatus: SaleStatusEnum) => {
  switch (saleStatus) {
    case SaleStatusEnum.Pending:
      return t('Get Ready')
    case SaleStatusEnum.Premint:
      return t('Get Ready')
    case SaleStatusEnum.Presale:
      return t('Presale')
    case SaleStatusEnum.Sale:
      return t('Public Sale')
    case SaleStatusEnum.DrawingRandomness:
      return t('Public Sale')
    case SaleStatusEnum.Claim:
      return t('Claim Phase')
    default:
      return ''
  }
}

export const getEventStepStatus = ({
  eventStatus,
  saleStatus,
  startTimestamp,
}: getEventStepStatusType): EventStatus => {
  const now = Date.now()
  if (eventStatus.every((status) => status < saleStatus)) return 'past'
  if (eventStatus.some((status) => status === saleStatus)) {
    if (startTimestamp && saleStatus === SaleStatusEnum.Presale && now > startTimestamp - FIFTEEN_MINUTES * 1000) {
      return 'past'
    }
    return 'live'
  }
  return 'upcoming'
}

const getTimePeriodFromTimeStamp = ({
  startTimestamp,
  timestampOffsetInSeconds = 0,
}: getTimePeriodFromTimeStampType) => {
  if (!startTimestamp) return ''

  const nowInSeconds = Date.now() / 1000
  const startTimestampInSeconds = startTimestamp / 1000 - timestampOffsetInSeconds
  const timePeriods = getTimePeriods(Math.round(startTimestampInSeconds - nowInSeconds))
  return formatTimePeriod(timePeriods) || '0s'
}

export const getEventText = ({ eventStatus, saleStatus, startTimestamp, t }: getEventTextType): string => {
  const eventStepStatus = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })
  if (eventStepStatus === 'live' && saleStatus === SaleStatusEnum.DrawingRandomness)
    return `${eventTextMapping(t, eventStatus[0])}: ${t('Sold Out!')}`
  if (eventStepStatus === 'live' && saleStatus > 0) {
    if (saleStatus === SaleStatusEnum.Presale) {
      return `${eventTextMapping(t, eventStatus[0])}: ${t('end in')} ${getTimePeriodFromTimeStamp({
        startTimestamp,
        timestampOffsetInSeconds: FIFTEEN_MINUTES,
      })}`
    }

    if (saleStatus === SaleStatusEnum.DrawingRandomness) {
      return `${eventTextMapping(t, eventStatus[0])}: ${t('Sold Out!')}`
    }

    if (saleStatus > SaleStatusEnum.Premint) {
      return `${eventTextMapping(t, eventStatus[0])}: ${t('Now Live')}`
    }
  }
  if (eventStepStatus === 'past' && eventStatus[0] === SaleStatusEnum.Presale) {
    return `${eventTextMapping(t, eventStatus[0])}: Closed`
  }
  if (eventStepStatus === 'upcoming') {
    return `${eventTextMapping(t, eventStatus[0])}: `
  }

  return eventTextMapping(t, eventStatus[0])
}

export const getAltText = ({ startTimestamp, eventStatus, saleStatus, t }: getAltTextType): string | undefined => {
  const eventStepStatus = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })
  if (saleStatus === SaleStatusEnum.DrawingRandomness && eventStepStatus === 'upcoming') return t('Starting Soon')
  if (eventStepStatus === 'upcoming' && eventStatus[0] === SaleStatusEnum.Presale) {
    return `${t('starts in')} ${getTimePeriodFromTimeStamp({ startTimestamp: PRESALE_TIMESTAMP })}`
  }
  if (startTimestamp && eventStepStatus === 'upcoming' && eventStatus[0] === SaleStatusEnum.Sale) {
    return `${t('starts in')} ${getTimePeriodFromTimeStamp({ startTimestamp })}`
  }
  return undefined
}
