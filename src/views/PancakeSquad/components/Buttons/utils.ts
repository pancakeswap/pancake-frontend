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
  isGen0User: boolean
  saleStatus: SaleStatusEnum
  startTimestamp: number
}

export const getBuyButton = ({
  isApproved,
  isGen0User,
  saleStatus,
  startTimestamp,
  isUserReady,
}: getBuyButtonProps) => {
  const now = Date.now()
  if (!isApproved) return BuyButtonsEnum.ENABLE
  if (isUserReady) return BuyButtonsEnum.READY
  if (
    (saleStatus === SaleStatusEnum.Presale && isGen0User) ||
    (saleStatus === SaleStatusEnum.Sale && now >= startTimestamp)
  )
    return BuyButtonsEnum.BUY

  return BuyButtonsEnum.NONE
}
