import React from 'react'
import { AutoRenewIcon, Flex, Heading } from '@tovaswapui/uikit'
import orderBy from 'lodash/orderBy'
import useSWR from 'swr'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import TeamListCard from './components/TeamListCard'
import TeamHeader from './components/TeamHeader'
import { getTeams } from '../../state/teams/helpers'
import { FetchStatus } from '../../config/constants/types'

const Teams = () => {
  const { t } = useTranslation()
  const { data, status } = useSWR('teams', async () => getTeams())
  const teamList = data ? Object.values(data) : []
  const topTeams = orderBy(teamList, ['points', 'id', 'name'], ['desc', 'asc', 'asc'])

  return (
    <Page>
      <TeamHeader />
      <Flex alignItems="center" justifyContent="space-between" mb="32px">
        <Heading scale="xl">{t('Teams')}</Heading>
        {status !== FetchStatus.Fetched && <AutoRenewIcon spin />}
      </Flex>
      {topTeams.map((team, index) => (
        <TeamListCard key={team.id} rank={index + 1} team={team} />
      ))}
    </Page>
  )
}

export default Teams
