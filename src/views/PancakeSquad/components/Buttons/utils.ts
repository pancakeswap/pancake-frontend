import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum } from 'views/PancakeSquad/types'

type getBuyButtonTextProps = {
  t: ContextApi['t']
  canBuyTickets: boolean
  saleStatus: SaleStatusEnum
  numberTicketsOfUser: number
}

const getBuyButtonText = ({ t, canBuyTickets, saleStatus, numberTicketsOfUser }: getBuyButtonTextProps) => {
  if ((saleStatus === SaleStatusEnum.Presale || saleStatus === SaleStatusEnum.Sale) && !canBuyTickets)
    return numberTicketsOfUser > 0 ? t('Max purchased') : t('Not eligible')

  return t('Buy Tickets')
}

export default getBuyButtonText
