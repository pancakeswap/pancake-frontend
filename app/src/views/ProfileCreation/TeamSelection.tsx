import React, { useMemo } from 'react'
import { Card, CardBody, CommunityIcon, Flex, Heading, Text } from '@pancakeswap/uikit'
import shuffle from 'lodash/shuffle'
import { useTeams } from 'state/teams/hooks'
import { useTranslation } from 'contexts/Localization'
import SelectionCard from './SelectionCard'
import NextStepButton from './NextStepButton'
import useProfileCreation from './contexts/hook'

const Team: React.FC = () => {
  const { teamId: currentTeamId, actions } = useProfileCreation()
  const { t } = useTranslation()
  const { teams } = useTeams()
  const handleTeamSelection = (value: string) => actions.setTeamId(parseInt(value, 10))
  const teamValues = useMemo(() => shuffle(Object.values(teams)), [teams])

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 3 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Join a Team')}
      </Heading>
      <Text as="p" mb="24px">
        {t('It won’t be possible to undo the choice you make for the foreseeable future!')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Join a Team')}
          </Heading>
          <Text as="p" color="textSubtle" mb="24px">
            {t(
              'There’s currently no big difference between teams, and no benefit of joining one team over another for now. So pick whichever one you like!',
            )}
          </Text>
          {teamValues &&
            teamValues.map((team) => {
              return (
                <SelectionCard
                  key={team.name}
                  name="teams-selection"
                  value={team.id}
                  isChecked={currentTeamId === team.id}
                  image={`/images/teams/${team.images.md}`}
                  onChange={handleTeamSelection}
                  disabled={!team.isJoinable}
                >
                  <Text bold>{team.name}</Text>
                  <Flex>
                    <CommunityIcon mr="8px" />
                    <Text>{team.users.toLocaleString()}</Text>
                  </Flex>
                </SelectionCard>
              )
            })}
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={currentTeamId === null}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default Team
