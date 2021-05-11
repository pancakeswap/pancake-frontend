import React from 'react'
import { Heading, Text } from '@pancakeswap/uikit'
import { useProfile } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import HeaderWrapper from 'views/Profile/components/HeaderWrapper'
import NoProfileCard from './NoProfileCard'

const TeamHeader = () => {
  const { t } = useTranslation()
  const { isInitialized, profile } = useProfile()
  const showProfileCallout = isInitialized && !profile

  return (
    <>
      {showProfileCallout && <NoProfileCard />}
      <HeaderWrapper>
        <Heading as="h1" scale="xxl" color="secondary">
          {t('Teams & Profiles')}
        </Heading>
        <Text bold>
          {t('Show off your stats and collectibles with your unique profile. Team features will be revealed soon!')}
        </Text>
      </HeaderWrapper>
    </>
  )
}

export default TeamHeader
