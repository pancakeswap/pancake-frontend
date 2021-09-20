import { EventStatus } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import formatTimePeriod from 'utils/formatTimePeriod'
import getTimePeriods from 'utils/getTimePeriods'
import { SaleStatusEnum } from './types'

type nftSaleType = {
  t: ContextApi['t']
  saleStatus?: SaleStatusEnum
  startTimestamp?: number
}

const eventTextMapping: Record<SaleStatusEnum, string> = {
  [SaleStatusEnum.Pending]: 'Get Ready',
  [SaleStatusEnum.Premint]: 'Get Ready',
  [SaleStatusEnum.Presale]: 'Presale',
  [SaleStatusEnum.Sale]: 'Public Sale',
  [SaleStatusEnum.DrawingRandomness]: 'Public Sale',
  [SaleStatusEnum.Claim]: 'Claim Phase',
}

type getEventStepStatus = {
  eventStatus: SaleStatusEnum[]
  saleStatus: SaleStatusEnum
  startTimestamp?: number
}
const getEventStepStatus = ({ eventStatus, saleStatus, startTimestamp }: getEventStepStatus): EventStatus => {
  const now = Date.now()
  if (eventStatus.every((status) => status < saleStatus)) return 'past'
  if (eventStatus.some((status) => status === saleStatus)) {
    if (startTimestamp && now > startTimestamp) return 'live'
    if (!startTimestamp) return 'live'
  }
  return 'upcoming'
}

type getEventTextType = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  eventStatus: SaleStatusEnum[]
  startTimestamp?: number
}
const getEventText = ({ eventStatus, saleStatus, startTimestamp, t }: getEventTextType): string => {
  const eventStepStatus = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })
  if (eventStepStatus === 'live' && saleStatus === SaleStatusEnum.DrawingRandomness)
    return `${t(eventTextMapping[eventStatus[0]])}: ${t('Sold Out!')}`
  if (eventStepStatus === 'live') return `${t(eventTextMapping[eventStatus[0]])}: ${t('Now Live')}`
  if (eventStepStatus === 'upcoming') return `${t(eventTextMapping[eventStatus[0]])}: `

  return t(eventTextMapping[eventStatus[0]])
}

type getAltTextType = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  eventStatus: SaleStatusEnum[]
  startTimestamp?: number
}
const getAltText = ({ startTimestamp, eventStatus, saleStatus, t }: getAltTextType): string | undefined => {
  const nowInSeconds = Date.now() / 1000
  const startTimestampInSeconds = startTimestamp / 1000
  const eventStepStatus = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })
  if (saleStatus === SaleStatusEnum.DrawingRandomness && eventStepStatus === 'upcoming') return t('Starting Soon')
  if (startTimestamp && eventStepStatus === 'upcoming' && saleStatus === SaleStatusEnum.Sale) {
    const timePeriods = getTimePeriods(Math.round(startTimestampInSeconds - nowInSeconds))
    return formatTimePeriod(timePeriods)
  }
  return undefined
}

const nftSaleConfigBuilder = ({ t, saleStatus, startTimestamp }: nftSaleType) =>
  saleStatus
    ? [
        {
          status: getEventStepStatus({ saleStatus, eventStatus: [SaleStatusEnum.Pending, SaleStatusEnum.Premint] }),
          text: getEventText({ saleStatus, eventStatus: [SaleStatusEnum.Pending, SaleStatusEnum.Premint], t }),
          infoText: t(
            'Activate your profile and make sure you  have at least 5 BNB in your wallet to buy a Minting Ticket.',
          ),
        },
        {
          status: getEventStepStatus({ saleStatus, eventStatus: [SaleStatusEnum.Presale] }),
          text: getEventText({ saleStatus, eventStatus: [SaleStatusEnum.Presale], t }),
          altText: getAltText({ t, saleStatus, eventStatus: [SaleStatusEnum.Presale], startTimestamp }),
          infoText: t(
            'During this phase, any wallet holding a Minting Ticket can redeem their ticket to mint a Pancake Squad NFT.',
          ),
        },
        {
          status: getEventStepStatus({
            saleStatus,
            eventStatus: [SaleStatusEnum.Sale, SaleStatusEnum.DrawingRandomness],
            startTimestamp,
          }),
          text: getEventText({
            saleStatus,
            startTimestamp,
            eventStatus: [SaleStatusEnum.Sale, SaleStatusEnum.DrawingRandomness],
            t,
          }),
          altText: getAltText({
            t,
            saleStatus,
            eventStatus: [SaleStatusEnum.Sale, SaleStatusEnum.DrawingRandomness],
            startTimestamp,
          }),
          infoText: t(
            'Public Sale: Any wallet with an active Pancake Profile can purchase up to 20 Minting Tickets, while stocks last.',
          ),
        },
        {
          status: getEventStepStatus({ saleStatus, eventStatus: [SaleStatusEnum.Claim] }),
          text: getEventText({ saleStatus, eventStatus: [SaleStatusEnum.Claim], t }),
          altText: getAltText({ t, saleStatus, eventStatus: [SaleStatusEnum.Claim] }),
          infoText: t(
            'Pre-sale: Wallets which held “Gen 0” Pancake Bunnies NFTs (bunnyID 0,1,2,3,4) at block xxxxxxx can purchase one Minting Ticket per Gen 0 NFT.',
          ),
        },
      ]
    : []

export default nftSaleConfigBuilder
