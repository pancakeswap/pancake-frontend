import React from 'react'
import { Card, CardBody, Heading, Text, Skeleton } from '@pancakeswap-libs/uikit'
import times from 'lodash/times'
import shuffle from 'lodash/shuffle'
import useI18n from 'hooks/useI18n'
import useTeams from 'hooks/useTeams'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import useProfileCreation from './contexts/hook'

interface Team {
  name: string
  description: string
  isJoinable: boolean
}

const Team: React.FC = () => {
  const { teamId: currentTeamId, actions } = useProfileCreation()
  const TranslateString = useI18n()
  const teams = useTeams()
  const handleTeamSelection = (value: string) => actions.setTeamId(parseInt(value, 10))

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
          {!teams && times(3).map((key) => <Skeleton key={key} height="80px" mb="16px" />)}
          {teams &&
            shuffle(teams).map((team, index) => {
              // Team indices start at 1
              const teamId = index + 1

              return (
                <SelectionCard
                  key={team.name}
                  name="teams-selection"
                  value={teamId}
                  isChecked={currentTeamId === teamId}
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
      <NextStepButton onClick={actions.nextStep} disabled={currentTeamId === null}>
        {TranslateString(999, 'Next Step')}
      </NextStepButton>
    </>
  )
}

export default Team
