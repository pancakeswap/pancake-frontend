import { ContextApi } from '@pancakeswap/localization'
import { SaleStatusEnum } from 'views/PancakeSquad/types'
import { BuyButtonsEnum } from './types'

type getBuyButtonTextProps = {
  t: ContextApi['t']
  canBuyTickets: boolean
  saleStatus: SaleStatusEnum
  numberTicketsOfUser: number
}

export const getBuyButtonText = ({ t, canBuyTickets, saleStatus, numberTicketsOfUser }: getBuyButtonTextProps) => {
  if ((saleStatus === SaleStatusEnum.Presale || saleStatus === SaleStatusEnum.Sale) && !canBuyTickets) {
    if (numberTicketsOfUser > 0) {
      return saleStatus === SaleStatusEnum.Presale ? t('Presale max purchased') : t('Max purchased')
    }
    return t('Not eligible')
  }

  return t('Buy Tickets')
}

type getBuyButtonProps = {
  isApproved: boolean
  isUserReady: boolean
  isGen0User: boolean
  saleStatus: SaleStatusEnum
  startTimestamp: number
  numberTicketsUsedForGen0: number
}

const FIFTEEN_MINUTES = 60 * 15

export const getBuyButton = ({
  isApproved,
  isGen0User,
  saleStatus,
  startTimestamp,
  isUserReady,
  numberTicketsUsedForGen0,
}: getBuyButtonProps) => {
  const now = Date.now()
  if (!isApproved) return BuyButtonsEnum.ENABLE
  if (isUserReady) return BuyButtonsEnum.READY
  if (
    (saleStatus === SaleStatusEnum.Presale &&
      (isGen0User || numberTicketsUsedForGen0 > 0) &&
      now < startTimestamp - FIFTEEN_MINUTES * 1000) ||
    (saleStatus === SaleStatusEnum.Sale && now >= startTimestamp)
  )
    return BuyButtonsEnum.BUY

  return BuyButtonsEnum.NONE
}
