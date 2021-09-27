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

type getAltTextType = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  eventStatus: SaleStatusEnum[]
  startTimestamp?: number
}

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

const eventTextMapping: Record<SaleStatusEnum, string> = {
  [SaleStatusEnum.Pending]: 'Get Ready',
  [SaleStatusEnum.Premint]: 'Get Ready',
  [SaleStatusEnum.Presale]: 'Presale',
  [SaleStatusEnum.Sale]: 'Public Sale',
  [SaleStatusEnum.DrawingRandomness]: 'Public Sale',
  [SaleStatusEnum.Claim]: 'Claim Phase',
}

export const getEventStepStatus = ({
  eventStatus,
  saleStatus,
  startTimestamp,
}: getEventStepStatusType): EventStatus => {
  const now = Date.now()
  if (eventStatus.every((status) => status < saleStatus)) return 'past'
  if (eventStatus.some((status) => status === saleStatus)) {
    if (startTimestamp && now > startTimestamp) return 'live'
    if (!startTimestamp) return 'live'
  }
  return 'upcoming'
}

export const getEventText = ({ eventStatus, saleStatus, startTimestamp, t }: getEventTextType): string => {
  const eventStepStatus = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })
  if (eventStepStatus === 'live' && saleStatus === SaleStatusEnum.DrawingRandomness)
    return `${t(eventTextMapping[eventStatus[0]])}: ${t('Sold Out!')}`
  if (eventStepStatus === 'live') return `${t(eventTextMapping[eventStatus[0]])}: ${t('Now Live')}`
  if (eventStepStatus === 'upcoming') return `${t(eventTextMapping[eventStatus[0]])}: `

  return t(eventTextMapping[eventStatus[0]])
}

export const getAltText = ({ startTimestamp, eventStatus, saleStatus, t }: getAltTextType): string | undefined => {
  const nowInSeconds = Date.now() / 1000
  const startTimestampInSeconds = startTimestamp / 1000
  const eventStepStatus = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })
  if (saleStatus === SaleStatusEnum.DrawingRandomness && eventStepStatus === 'upcoming') return t('Starting Soon')
  if (startTimestamp && eventStepStatus === 'upcoming' && eventStatus[0] === SaleStatusEnum.Sale) {
    const timePeriods = getTimePeriods(Math.round(startTimestampInSeconds - nowInSeconds))
    return formatTimePeriod(timePeriods)
  }
  return undefined
}
