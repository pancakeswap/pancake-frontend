import React, { useState, useEffect, useContext } from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { getProfileContract } from 'utils/contractHelpers'
import { getWeb3 } from 'utils/web3'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

interface Team {
  name: string
  description: string
  isJoinable: boolean
}

const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([])
  useEffect(() => {
    const fetchteams = async () => {
      try {
        const contract = getProfileContract()
        const nbTeams = await contract.methods.numberTeams().call()

        const web3 = getWeb3()
        const batch = new web3.BatchRequest()
        for (let i = 1; i <= nbTeams; i++) {
          batch.add(
            contract.methods.getTeamProfile(i).call.request({}, (error, result) => {
              if (error) {
                console.error(error)
              } else {
                setTeams((prev) => [...prev, { name: result[0], description: result[1], isJoinable: result[3] }])
              }
            }),
          )
        }
        batch.execute()
      } catch (error) {
        console.error(error)
      }
    }
    fetchteams()
  }, [])
  return teams
}

const Team: React.FC = () => {
  const { teamId, setTeamId, nextStep } = useContext(ProfileCreationContext)
  const TranslateString = useI18n()
  const teams = useTeams()

  const handleTeamSelection = (value: string) => setTeamId(parseInt(value, 10))

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {TranslateString(999, `Step ${3}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {TranslateString(999, 'Join a Team')}
      </Heading>
      <Text as="p" mb="24px">
        {TranslateString(999, 'It won’t be possible to undo the choice you make for the foreseeable future!')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {TranslateString(999, 'Join a Team')}
          </Heading>
          <Text as="p" color="textSubtle" mb="24px">
            {TranslateString(
              999,
              'There’s currently no big difference between teams, and no benefit of joining one team over another for now. So pick whichever one you like!',
            )}
          </Text>
          {teams.map((team, index) => {
            return (
              <SelectionCard
                key={team.name}
                name="teams-selection"
                value={index}
                isChecked={teamId === index}
                image="/onsen-preview.png"
                onChange={handleTeamSelection}
                disabled={!team.isJoinable}
              >
                <Text bold>{team.name}</Text>
              </SelectionCard>
            )
          })}
        </CardBody>
      </Card>
      <NextStepButton onClick={nextStep}>{TranslateString(999, 'Next Step')}</NextStepButton>
    </>
  )
}

export default Team
