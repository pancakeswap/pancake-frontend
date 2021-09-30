import { SaleStatusEnum, UserStatusEnum } from 'views/PancakeSquad/types'
import { ButtonsEnum } from './types'

type getCurrentButtonType = {
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  numberTicketsOfUser: number
  startTimestamp: number
}

export const getCurrentButton = ({
  userStatus,
  saleStatus,
  numberTicketsOfUser,
  startTimestamp,
}: getCurrentButtonType): ButtonsEnum => {
  const isBuyingFinished = saleStatus > SaleStatusEnum.Sale
  const now = Date.now()
  if (userStatus === UserStatusEnum.NO_PROFILE && !isBuyingFinished) return ButtonsEnum.ACTIVATE
  if (saleStatus === SaleStatusEnum.Presale || (saleStatus === SaleStatusEnum.Sale && now > startTimestamp))
    return ButtonsEnum.BUY
  if (saleStatus === SaleStatusEnum.Claim && numberTicketsOfUser > 0) return ButtonsEnum.MINT
  if (saleStatus === SaleStatusEnum.Claim) return ButtonsEnum.END

  return ButtonsEnum.NONE
}
