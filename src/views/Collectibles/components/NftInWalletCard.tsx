import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import CardContent from './CardContent'

const NftInWalletCard = () => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardBody>
        <CardContent imgSrc="/images/present.svg">
          <Heading mb="8px">{t('NFT in wallet')}</Heading>
          <Text>{t('Trade in your NFT for CAKE, or just keep it for your collection.')}</Text>
        </CardContent>
      </CardBody>
    </Card>
  )
}

export default NftInWalletCard
