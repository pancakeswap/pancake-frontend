import React, { useEffect, useState } from 'react'
import Page from 'components/layout/Page'
import { Link, Redirect, useParams } from 'react-router-dom'
import { ChevronLeftIcon, Flex, Text } from '@pancakeswap-libs/uikit'
import PageLoader from 'components/PageLoader'
import { Team as TeamType } from 'state/types'
import useI18n from 'hooks/useI18n'
import { getProfileContract } from 'utils/contractHelpers'
import { TeamResponse, transformTeamResponse } from 'state/profile/helpers'
import TeamCard from './components/TeamCard'
import TeamHeader from './components/TeamHeader'

const Team = () => {
  const { id }: { id: string } = useParams()
  const [is404, setIs404] = useState(false)
  const [team, setTeam] = useState<TeamType>(null)
  const TranslateString = useI18n()

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const pancakeProfileContract = getProfileContract()
        const response = await pancakeProfileContract.methods.getTeamProfile(id).call()
        const teamData = transformTeamResponse(response as TeamResponse)
        setTeam(teamData)
      } catch (error) {
        setIs404(true)
      }
    }

    fetchTeam()
  }, [id, setTeam, setIs404])

  if (is404) {
    return <Redirect to="/404" />
  }

  if (!team) {
    return <PageLoader />
  }

  return (
    <Page>
      <TeamHeader />
      <Flex mb="24px">
        <Link to="/teams">
          <Flex alignItems="center">
            <ChevronLeftIcon color="primary" />
            <Text color="primary">{TranslateString(999, 'Teams Overview')}</Text>
          </Flex>
        </Link>
      </Flex>
      <TeamCard team={team} />
    </Page>
  )
}

export default Team
