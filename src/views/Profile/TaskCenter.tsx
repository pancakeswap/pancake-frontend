import React from 'react'
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import AchievementsList from './components/AchievementsList'
import ClaimPointsCallout from './components/ClaimPointsCallout '
import ComingSoon from './components/ComingSoon'
import Menu from './components/Menu'

const TaskCenter = () => {
  const TranslateString = useI18n()

  return (
    <>
      <Menu />
      <ClaimPointsCallout />
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
          <AchievementsList />
        </CardBody>
      </Card>
      <Card mb="32px">
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading size="lg" mb="8px">
                {TranslateString(1090, 'Task Center')}
              </Heading>
              <Text as="p">{TranslateString(1088, 'Earn points by completing regular tasks!')}</Text>
              <Text as="p">
                {TranslateString(1086, 'Collecting points for these tasks makes them available again.')}
              </Text>
            </div>
          </Flex>
        </CardHeader>
        <CardBody>
          <ComingSoon />
        </CardBody>
      </Card>
    </>
  )
}

export default TaskCenter
