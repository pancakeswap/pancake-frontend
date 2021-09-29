import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum } from 'views/PancakeSquad/types'
import { BuyButtonsEnum } from './types'

type getBuyButtonTextProps = {
  t: ContextApi['t']
  canBuyTickets: boolean
  saleStatus: SaleStatusEnum
  numberTicketsOfUser: number
}

export const getBuyButtonText = ({ t, canBuyTickets, saleStatus, numberTicketsOfUser }: getBuyButtonTextProps) => {
  if ((saleStatus === SaleStatusEnum.Presale || saleStatus === SaleStatusEnum.Sale) && !canBuyTickets)
    return numberTicketsOfUser > 0 ? t('Max purchased') : t('Not eligible')

  return t('Buy Tickets')
}

type getBuyButtonProps = {
  isApproved: boolean
  isUserReady: boolean
  isSalePhase: boolean
}

export const getBuyButton = ({ isApproved, isSalePhase, isUserReady }: getBuyButtonProps) => {
  if (!isApproved) return BuyButtonsEnum.ENABLE
  if (isSalePhase) return BuyButtonsEnum.BUY
  if (isUserReady) return BuyButtonsEnum.READY

  return BuyButtonsEnum.NONE
}
