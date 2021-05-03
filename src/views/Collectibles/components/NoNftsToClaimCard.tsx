import React from 'react'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import SecondaryCard from './SecondaryCard'
import CardContent from './CardContent'

const NoNftsToClaimCard = () => {
  const { t } = useTranslation()

  return (
    <SecondaryCard>
      <CardContent imgSrc="/images/present-disabled.svg">
        <Heading mb="8px">{t('No NFTs to claim')}</Heading>
        <Text>{t('You have no NFTs to claim at this time, but you can still see the NFTs in this series below.')}</Text>
      </CardContent>
    </SecondaryCard>
  )
}

export default NoNftsToClaimCard
