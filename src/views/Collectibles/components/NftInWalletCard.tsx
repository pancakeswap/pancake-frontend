import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import CardContent from './CardContent'

const NftInWalletCard = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        <CardContent imgSrc="/images/present.svg">
          <Heading mb="8px">{TranslateString(999, 'NFT in wallet')}</Heading>
          <Text>{TranslateString(999, 'Trade in your NFT for CAKE, or just keep it for your collection.')}</Text>
        </CardContent>
      </CardBody>
    </Card>
  )
}

export default NftInWalletCard
