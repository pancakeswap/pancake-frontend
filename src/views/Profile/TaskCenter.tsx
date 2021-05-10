import React from 'react'
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import AchievementsList from './components/AchievementsList'
import ClaimPointsCallout from './components/ClaimPointsCallout '
import ComingSoon from './components/ComingSoon'
import Menu from './components/Menu'

const TaskCenter = () => {
  const { t } = useTranslation()

  return (
    <>
      <Menu />
      <ClaimPointsCallout />
      <Card mb="32px">
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading size="lg" mb="8px">
                {t('Achievements')}
              </Heading>
              <Text as="p">{t('Earn more points for completing larger quests!')}</Text>
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
                {t('Task Center')}
              </Heading>
              <Text as="p">{t('Earn points by completing regular tasks!')}</Text>
              <Text as="p">{t('Collecting points for these tasks makes them available again.')}</Text>
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
