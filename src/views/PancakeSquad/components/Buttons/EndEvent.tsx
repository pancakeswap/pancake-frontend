import React from 'react'
import { Button } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type EndEventProps = {
  t: ContextApi['t']
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  maxSupply: number
  totalSupplyMinted: number
  numberTokensOfUser: number
}

const EndEventButtons: React.FC<EndEventProps> = ({
  t,
  saleStatus,
  numberTokensOfUser,
  maxSupply,
  totalSupplyMinted,
}) => {
  const hasSquad = saleStatus === SaleStatusEnum.Claim && numberTokensOfUser > 0
  const canViewMarket = maxSupply === totalSupplyMinted

  return (
    <>
      {canViewMarket && <Button scale="sm">{t('View market')}</Button>}
      {hasSquad && <Button scale="sm">{t('Your Squad (%tokens%)', { tokens: numberTokensOfUser })}</Button>}
    </>
  )
}

export default EndEventButtons
