import { ChevronLeftIcon, Flex, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import teams from 'config/constants/teams'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useTeam } from 'state/teams/hooks'
import TeamCard from './components/TeamCard'
import TeamHeader from './components/TeamHeader'

const Team = () => {
  const router = useRouter()
  const idStr = typeof router.query.id === 'string' ? router.query.id : ''
  const id = Number(idStr)
  const { t } = useTranslation()
  const isValidTeamId = teams.findIndex((team) => team.id === id) !== -1
  const team = useTeam(id)

  useEffect(() => {
    if (!isValidTeamId) {
      router.push('/404')
    }
  }, [isValidTeamId, router])

  if (!team) {
    return <PageLoader />
  }

  return (
    <Page>
      <TeamHeader />
      <Flex mb="24px">
        <Link href="/teams" passHref>
          <Flex alignItems="center" as="a">
            <ChevronLeftIcon color="primary" />
            <Text color="primary">{t('Teams Overview')}</Text>
          </Flex>
        </Link>
      </Flex>
      <TeamCard team={team} />
    </Page>
  )
}

export default Team
