import React from 'react'
import { CardBody, CardHeader, Flex, Text, WaitIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Position } from 'state/types'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'

const NextCard = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardHeader p="8px">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <WaitIcon mr="4px" width="14px" />
            <Text fontSize="14px">{TranslateString(999, 'Later')}</Text>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody p="16px">
        <MultiplierArrow isDisabled />
        <RoundInfoBox>Coming soon</RoundInfoBox>
        <MultiplierArrow roundPosition={Position.DOWN} isDisabled />
      </CardBody>
    </Card>
  )
}

export default NextCard
