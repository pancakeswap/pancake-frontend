import React from 'react'
import Link from 'next/link'
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
        <Button mb={['4px', null, null, '0']} mr={[0, null, null, '4px']}>
          <Link href="/nfts">
            <a>{t('View market')}</a>
          </Link>
        </Button>
      )}
      {hasSquad && (
        <Button>
          <Link href={`/nfts/profile/${account}`}>
            <a>{t('Your Squad (%tokens%)', { tokens: numberTokensOfUser })}</a>
          </Link>
        </Button>
      )}
    </Flex>
  )
}

export default EndEventButtons
