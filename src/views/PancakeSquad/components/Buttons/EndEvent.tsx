import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Flex } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { SaleStatusEnum, UserStatusEnum } from '../../types'

type EndEventProps = {
  t: ContextApi['t']
  account: string
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  maxSupply: number
  totalSupplyMinted: number
  numberTokensOfUser: number
}

const EndEventButtons: React.FC<EndEventProps> = ({
  t,
  account,
  saleStatus,
  numberTokensOfUser,
  maxSupply,
  totalSupplyMinted,
}) => {
  const hasSquad = saleStatus === SaleStatusEnum.Claim && numberTokensOfUser > 0
  const canViewMarket = maxSupply === totalSupplyMinted

  return (
    <Flex flexDirection={['column', null, null, 'row']}>
      {canViewMarket && (
        <Link to="/nfts">
          <Button width="100%" mb={['4px', null, null, '0']} mr={[0, null, null, '4px']}>
            {t('View market')}
          </Button>
        </Link>
      )}
      {hasSquad && (
        <Link to={`/nfts/profile/${account}`}>
          <Button width="100%">{t('Your Squad (%tokens%)', { tokens: numberTokensOfUser })}</Button>
        </Link>
      )}
    </Flex>
  )
}

export default EndEventButtons
