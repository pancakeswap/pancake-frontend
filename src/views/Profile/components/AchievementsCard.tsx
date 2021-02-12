import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useAchievements } from 'state/hooks'
import AchievementCard from './AchievementCard'

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const AchievementsCard = () => {
  const TranslateString = useI18n()
  const achievements = useAchievements()

  return (
    <Card mb="32px">
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          <div>
            <Heading size="lg" mb="8px">
              {TranslateString(1092, 'Achievements')}
            </Heading>
            <Text as="p">{TranslateString(1084, 'Earn more points for completing larger quests!')}</Text>
          </div>
        </Flex>
      </CardHeader>
      <CardBody>
        <Grid>
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </Grid>
        {achievements.length === 0 && (
          <Flex alignItems="center" justifyContent="center" style={{ height: '64px' }}>
            <Heading as="h5" size="md" color="textDisabled">
              {TranslateString(999, 'No achievments yet!')}
            </Heading>
          </Flex>
        )}
      </CardBody>
    </Card>
  )
}

export default AchievementsCard
