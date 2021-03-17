import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Text, Heading, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { YourScoreProps } from '../../types'

const ScoreCard: React.FC<YourScoreProps> = ({ registered, account, profile }) => {
  const TranslateString = useI18n()

  const headingText = () => {
    if (!account) {
      return 'Check your Rank'
    }
    if (!registered) {
      return 'You’re not participating this time.'
    }
    if (profile) {
      return `@${profile.username}`
    }
    return ''
  }

  const subHeadingText = () => {
    if (!account) {
      return 'Connect wallet to view'
    }
    if (!registered) {
      return 'Sorry, you needed to register during the “entry” period!'
    }
    if (profile) {
      return `${profile.team.name}`
    }
    return ''
  }

  return (
    <Card>
      <CardBody>
        <Flex flexDirection="column">
          <Heading textAlign="center">{TranslateString(999, headingText())}</Heading>
          <Text textAlign="center" fontSize="14px" color="textSubtle" mt="4px">
            {TranslateString(999, subHeadingText())}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default ScoreCard
