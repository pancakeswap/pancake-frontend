import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum } from './types'
import { getAltText, getEventStepStatus, getEventText } from './utils'

type nftSaleType = {
  t: ContextApi['t']
  saleStatus?: SaleStatusEnum
  startTimestamp?: number
}

const nftSaleConfigBuilder = ({ t, saleStatus, startTimestamp }: nftSaleType) =>
  saleStatus !== undefined
    ? [
        {
          status: getEventStepStatus({ saleStatus, eventStatus: [SaleStatusEnum.Pending, SaleStatusEnum.Premint] }),
          text: getEventText({ saleStatus, eventStatus: [SaleStatusEnum.Pending, SaleStatusEnum.Premint], t }),
          infoText: t(
            'Activate your profile and make sure you have at least the cost of 1 NFT in your wallet to buy a Squad Ticket.',
          ),
        },
        {
          status: getEventStepStatus({ saleStatus, eventStatus: [SaleStatusEnum.Presale], startTimestamp }),
          text: getEventText({ saleStatus, eventStatus: [SaleStatusEnum.Presale], startTimestamp, t }),
          altText: getAltText({ t, saleStatus, eventStatus: [SaleStatusEnum.Presale], startTimestamp }),
          infoText: t(
            'Pre-sale: Wallets which held “Gen 0” Pancake Bunnies NFTs (bunnyID 0,1,2,3,4) at a snapshot taken some time between 12 and 2 hours before the presale begins can purchase one Squad Ticket per Gen 0 NFT.',
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
            'Public Sale: Any wallet with an active Pancake Profile can purchase up to 10 Squad Tickets, while stocks last.',
          ),
        },
        {
          status: getEventStepStatus({ saleStatus, eventStatus: [SaleStatusEnum.Claim] }),
          text: getEventText({ saleStatus, eventStatus: [SaleStatusEnum.Claim], t }),
          altText: getAltText({ t, saleStatus, eventStatus: [SaleStatusEnum.Claim] }),
          infoText: t(
            'During this phase, any wallet holding a Squad Ticket can redeem their ticket to mint a Pancake Squad NFT.',
          ),
        },
      ]
    : []

export default nftSaleConfigBuilder
