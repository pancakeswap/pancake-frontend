import React from 'react'
import Page from 'components/layout/Page'
import { Link, Redirect, useParams } from 'react-router-dom'
import { ChevronLeftIcon, Flex, Text } from '@pancakeswap-libs/uikit'
import PageLoader from 'components/PageLoader'
import teams from 'config/constants/teams'
import useI18n from 'hooks/useI18n'
import { useTeam } from 'state/hooks'
import TeamCard from './components/TeamCard'
import TeamHeader from './components/TeamHeader'
import LeadInBanner from '../TradingCompetition/components/LeadInBanner'

const Team = () => {
  const { id: idStr }: { id: string } = useParams()
  const id = Number(idStr)
  const TranslateString = useI18n()
  const isValidTeamId = teams.findIndex((team) => team.id === id) !== -1
  const team = useTeam(id)

  if (!isValidTeamId) {
    return <Redirect to="/404" />
  }

  if (!team) {
    return <PageLoader />
  }

  return (
    <>
      <LeadInBanner />
      <Page>
        <TeamHeader />
        <Flex mb="24px">
          <Link to="/teams">
            <Flex alignItems="center">
              <ChevronLeftIcon color="primary" />
              <Text color="primary">{TranslateString(1038, 'Teams Overview')}</Text>
            </Flex>
          </Link>
        </Flex>
        <TeamCard team={team} />
      </Page>
    </>
  )
}

export default Team
