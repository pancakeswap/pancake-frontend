import React from 'react'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Button, Flex } from '@tovaswapui/uikit'
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
        <Button mb={['4px', null, null, '0']} mr={[0, null, null, '4px']}>
          <NextLinkFromReactRouter to="/nfts">{t('View market')}</NextLinkFromReactRouter>
        </Button>
      )}
      {hasSquad && (
        <Button>
          <NextLinkFromReactRouter to={`/nfts/profile/${account}`}>
            {t('Your Squad (%tokens%)', { tokens: numberTokensOfUser })}
          </NextLinkFromReactRouter>
        </Button>
      )}
    </Flex>
  )
}

export default EndEventButtons
