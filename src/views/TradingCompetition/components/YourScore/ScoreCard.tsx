import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Text, Heading, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { YourScoreProps } from '../../types'

const ScoreCard: React.FC<YourScoreProps> = ({ registered }) => {
  const TranslateString = useI18n()

  return (
    <Card>
      <CardBody>
        {!registered ? (
          <Flex flexDirection="column">
            <Heading textAlign="center">{TranslateString(999, 'You’re not participating this time.')}</Heading>
            <Text textAlign="center" fontSize="14px" color="textSubtle" mt="4px">
              {TranslateString(999, 'Sorry, you needed to register during the “entry” period!')}
            </Text>
          </Flex>
        ) : (
          <Text>You are registered</Text>
        )}
      </CardBody>
    </Card>
  )
}

export default ScoreCard
