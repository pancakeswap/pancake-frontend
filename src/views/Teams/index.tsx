import React from 'react'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import Page from 'components/layout/Page'
import { useProfile } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import NoProfileCard from './components/NoProfileCard'

const Teams = () => {
  const TranslateString = useI18n()
  const { isInitialized, profile } = useProfile()
  const showProfileCallout = isInitialized && !profile

  return (
    <Page>
      {showProfileCallout && <NoProfileCard />}
      <Heading size="xxl" color="secondary">
        {TranslateString(999, 'Teams & Profiles')}
      </Heading>
      <Text bold>
        {TranslateString(
          999,
          'Show off your stats and collectibles with your unique profile. Team features will be revealed soon!',
        )}
      </Text>
    </Page>
  )
}

export default Teams
