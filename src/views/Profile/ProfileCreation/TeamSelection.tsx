import React, { useState, useEffect } from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import times from 'lodash/times'
import useI18n from 'hooks/useI18n'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { getProfileContract } from 'utils/contractHelpers'
import profileABI from 'config/abi/pancakeProfile.json'
import multicall from 'utils/multicall'
import SelectionCard from '../components/SelectionCard'

interface Props {
  selectedTeam: number
  handleTeamSelection: (team: number) => void
}

// To remove
const mockTeams = [
  {
    name: 'Team 1',
    description: 'team 1 description',
    image: 'drizzle-preview.png',
    numberUsers: 10,
    numberPoints: 100,
    isJoinable: true,
  },
  {
    name: 'Team 2',
    description: 'team 2 description',
    image: 'drizzle-preview.png',
    numberUsers: 10,
    numberPoints: 100,
    isJoinable: true,
  },
]

const useTeams = () => {
  const [teams, setTeams] = useState(null)
  useEffect(() => {
    const fetchteams = async () => {
      const contract = getProfileContract()
      const nbTeams = await contract.methods.numberTeams().call()
      const calls = times(nbTeams, (index) => ({
        address: getPancakeProfileAddress(),
        name: 'getTeamProfile',
        params: [index],
      }))

      const res = await multicall(profileABI, calls)
      setTeams(res)
    }
    fetchteams()
  }, [])
  return teams
}

const Team: React.FC<Props> = ({ selectedTeam, handleTeamSelection }) => {
  const TranslateString = useI18n()
  // const teams = useTeams()
  const teams = mockTeams

  return (
    <div>
      <Text fontSize="20px" color="textSubtle" bold>
        {TranslateString(999, `Step ${3}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {TranslateString(999, 'Join a Team')}
      </Heading>
      <Text as="p" mb="24px">
        {TranslateString(999, 'It won’t be possible to undo the choice you make for the foreseeable future!')}
      </Text>
      <Card>
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
                isChecked={selectedTeam === index}
                image={team.image}
                onChange={(val) => handleTeamSelection(parseInt(val, 10))}
              >
                <Text bold>{team.name}</Text>
                <Text fontSize="12px">{team.description}</Text>
              </SelectionCard>
            )
          })}
        </CardBody>
      </Card>
    </div>
  )
}

export default Team
