import React from 'react'
import { Heading, Skeleton, Text } from '@pancakeswap-libs/uikit'
import orderBy from 'lodash/orderBy'
import times from 'lodash/times'
import Page from 'components/layout/Page'
import { useProfile } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import useTeams from 'hooks/useTeams'
import HeaderWrapper from 'views/Profile/components/HeaderWrapper'
import NoProfileCard from './components/NoProfileCard'
import TeamCard from './components/TeamCard'

const Teams = () => {
  const TranslateString = useI18n()
  const { isInitialized, profile } = useProfile()
  const showProfileCallout = isInitialized && !profile
  const teams = useTeams()
  const topTeams = orderBy(teams, ['points', 'name'], ['desc', 'asc'])

  return (
    <Page>
      {showProfileCallout && <NoProfileCard />}
      <HeaderWrapper>
        <Heading size="xxl" color="secondary">
          {TranslateString(999, 'Teams & Profiles')}
        </Heading>
        <Text bold>
          {TranslateString(
            999,
            'Show off your stats and collectibles with your unique profile. Team features will be revealed soon!',
          )}
        </Text>
      </HeaderWrapper>
      <Heading size="xl" mb="32px">
        {TranslateString(999, 'Teams')}
      </Heading>
      {topTeams
        ? topTeams.map((team, index) => <TeamCard key={team.name} rank={index + 1} team={team} />)
        : times(3).map((n) => <Skeleton key={n} height="180px" mb="8px" />)}
    </Page>
  )
}

export default Teams
