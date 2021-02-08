import { Button, Card, CardBody, CardHeader, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import React from 'react'
import ComingSoon from './components/ComingSoon'
import Menu from './components/Menu'

const TaskCenter = () => {
  const TranslateString = useI18n()

  return (
    <>
      <Menu activeIndex={1} />
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
            <Button disabled>{TranslateString(1056, 'Collect')}</Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <ComingSoon />
        </CardBody>
      </Card>
      <Card mb="32px">
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading size="lg" mb="8px">
                {TranslateString(1092, 'Achievements')}
              </Heading>
              <Text as="p">{TranslateString(1084, 'Earn more points for completing larger quests!')}</Text>
            </div>
            <Button disabled>{TranslateString(1056, 'Collect')}</Button>
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
