import React from 'react'
import { Heading, Skeleton } from '@pancakeswap-libs/uikit'
import orderBy from 'lodash/orderBy'
import times from 'lodash/times'
import Page from 'components/layout/Page'
import useI18n from 'hooks/useI18n'
import useTeams from 'hooks/useTeams'
import TeamListCard from './components/TeamListCard'
import TeamHeader from './components/TeamHeader'

const Teams = () => {
  const TranslateString = useI18n()
  const teams = useTeams()
  const topTeams = orderBy(teams, ['points', 'name'], ['desc', 'asc'])

  return (
    <Page>
      <TeamHeader />
      <Heading size="xl" mb="32px">
        {TranslateString(999, 'Teams')}
      </Heading>
      {teams
        ? topTeams.map((team, index) => <TeamListCard key={team.name} rank={index + 1} team={team} />)
        : times(3).map((n) => <Skeleton key={n} height="182px" mb="8px" />)}
    </Page>
  )
}

export default Teams
