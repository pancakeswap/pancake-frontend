import { AutoRenewIcon, Flex, Heading } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import { getTeams } from 'state/teams/helpers'
import { useQuery } from '@tanstack/react-query'
import TeamListCard from './components/TeamListCard'
import TeamHeader from './components/TeamHeader'

const Teams = () => {
  const { t } = useTranslation()
  const { data, status } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  })
  const teamList = data ? Object.values(data) : []
  const topTeams = orderBy(teamList, ['points', 'id', 'name'], ['desc', 'asc', 'asc'])

  return (
    <Page>
      <TeamHeader />
      <Flex alignItems="center" justifyContent="space-between" mb="32px">
        <Heading scale="xl">{t('Teams')}</Heading>
        {status !== 'success' && <AutoRenewIcon spin />}
      </Flex>
      {topTeams.map((team, index) => (
        <TeamListCard key={team.id} rank={index + 1} team={team} />
      ))}
    </Page>
  )
}

export default Teams
