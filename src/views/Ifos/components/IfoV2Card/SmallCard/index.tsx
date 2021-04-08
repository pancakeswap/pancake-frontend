import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, CardHeader, Text } from '@pancakeswap-libs/uikit'
import { Ifo } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'hooks/ifo/v1/types'
import IfoCardHeader from './IfoCardHeader'
import IfoCardDetails from './IfoCardDetails'
import IfoCardActions from './IfoCardActions'

type CardType = 'basic' | 'unlimited'

interface IfoCardProps {
  ifo: Ifo
  cardType: CardType
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
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

const IfoCard: React.FC<IfoCardProps> = ({ ifo, publicIfoData, walletIfoData, cardType }) => {
  const { id, name, subTitle } = ifo
  const config = cardConfig[cardType]

  return (
    <StyledIfoCard ifoId={id}>
      <CardHeader variant={config.variant}>
        <Text bold fontSize="20px">
          {config.title}
        </Text>
      </CardHeader>
      <CardBody>
        <IfoCardHeader ifoId={id} name={name} subTitle={subTitle} />
        <IfoCardActions ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
      </CardBody>
      <IfoCardDetails ifo={ifo} publicIfoData={publicIfoData} />
    </StyledIfoCard>
  )
}

export default IfoCard
