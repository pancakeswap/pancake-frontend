import React from 'react'
import { CardBody, CardHeader, Flex, Text, WaitIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Card from './Card'
import EnterPositionCallout from './EnterPositionCallout'
import MultiplierArrow from './MultiplierArrow'
import { PositionType } from './types'

const PositionCard: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardHeader p="8px">
        <Flex alignItems="center">
          <WaitIcon mr="4px" width="14px" />
          <Text>{TranslateString(999, 'Expired')}</Text>
        </Flex>
      </CardHeader>
      <CardBody p="16px">
        <MultiplierArrow multiplier={10.3} hasEntered />
        <EnterPositionCallout isLive={false} prizePool={1200} />
        <MultiplierArrow multiplier={1} positionType={PositionType.DOWN} hasEntered={false} />
      </CardBody>
    </Card>
  )
}

export default PositionCard
