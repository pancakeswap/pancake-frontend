import React from 'react'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import SecondaryCard from './SecondaryCard'
import CardContent from './CardContent'

const NoNftsToClaimCard = () => {
  const TranslateString = useI18n()

  return (
    <SecondaryCard>
      <CardContent imgSrc="/images/present-disabled.svg">
        <Heading mb="8px">{TranslateString(999, 'No NFTs to claim')}</Heading>
        <Text>
          {TranslateString(
            999,
            'You have no NFTs to claim at this time, but you can still see the NFTs in this series below.',
          )}
        </Text>
      </CardContent>
    </SecondaryCard>
  )
}

export default NoNftsToClaimCard
