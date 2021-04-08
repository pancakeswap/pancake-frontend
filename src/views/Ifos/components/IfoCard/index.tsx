import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, CardHeader, Text, Flex, Image } from '@pancakeswap-libs/uikit'
import { Ifo } from 'config/constants/types'
import { PublicIfoState } from 'hooks/useGetPublicIfoData'
import { WalletIfoData } from 'hooks/useGetWalletIfoData'
import IfoCardActions from './IfoCardActions'

type CardType = 'basic' | 'unlimited'

interface IfoCardProps {
  ifo: Ifo
  cardType: CardType
  publicIfoData: PublicIfoState
  userIfoData: WalletIfoData
}

interface CardConfig {
  [key: string]: {
    title: string
    variant: 'blue' | 'violet'
  }
}

const cardConfig: CardConfig = {
  basic: {
    title: 'Basic Sale',
    variant: 'blue',
  },
  unlimited: {
    title: 'Unlimited Sale',
    variant: 'violet',
  },
}

const StyledIfoCard = styled(Card)<{ ifoId: string }>`
  margin-left: auto;
  margin-right: auto;
  max-width: 437px;
  width: 100%;
`

const TokenSection = ({ img, label, amount, ...props }) => {
  return (
    <Flex {...props}>
      <Image src={img} alt={label} width={32} height={32} mr="16px" />
      <div>
        <Text bold fontSize="12px" color="secondary" mb="8px">
          {label}
        </Text>
        <Text bold fontSize="20px">
          {amount}
        </Text>
      </div>
    </Flex>
  )
}

const IfoCard: React.FC<IfoCardProps> = ({ cardType, ifo, publicIfoData, userIfoData }) => {
  const { id, currency, token } = ifo

  const config = cardConfig[cardType]
  return (
    <StyledIfoCard ifoId={id} isActive={publicIfoData.status === 'live'}>
      <CardHeader variant={config.variant}>
        <Text bold fontSize="20px">
          {config.title}
        </Text>
      </CardHeader>
      <CardBody>
        <TokenSection label={`Your ${currency.symbol} committed`} amount={0} img="/images/farms/cake-bnb.svg" />
        <TokenSection
          label={`${token.symbol} to received`}
          amount={0}
          img={`/images/tokens/${token.symbol.toLocaleLowerCase()}.png`}
        />
        <IfoCardActions ifo={ifo} publicIfoData={publicIfoData} />
      </CardBody>
    </StyledIfoCard>
  )
}

export default IfoCard
