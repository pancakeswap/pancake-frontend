import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import { fetchAchievements } from 'state/achievements'
import useI18n from 'hooks/useI18n'
import AchievementsCard from './components/AchievementsCard'
import ClaimPointsCallout from './components/ClaimPointsCallout '
import ComingSoon from './components/ComingSoon'
import Menu from './components/Menu'

const TaskCenter = () => {
  const TranslateString = useI18n()
  const dispatch = useDispatch()
  const { account } = useWallet()

  // Get all user achievements
  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])

  return (
    <>
      <Menu />
      <ClaimPointsCallout />
      <AchievementsCard />
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
