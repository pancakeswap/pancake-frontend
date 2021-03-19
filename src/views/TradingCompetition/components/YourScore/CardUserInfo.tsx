import React from 'react'
import { Text, Heading, Flex, Skeleton } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { YourScoreProps } from '../../types'

const CardUserInfo: React.FC<YourScoreProps> = ({ registered, account, profile }) => {
  const TranslateString = useI18n()

  const getHeadingText = () => {
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

  const getSubHeadingText = () => {
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

  const headingText = getHeadingText()
  const subHeadingText = getSubHeadingText()

  return (
    <Flex flexDirection="column" alignItems="center" mt="12px">
      <Heading size="lg" textAlign="center">
        {headingText ? TranslateString(999, headingText) : <Skeleton height={25} width={110} />}
      </Heading>
      <Text textAlign="center" fontSize="14px" color="textSubtle" mt="4px">
        {subHeadingText ? TranslateString(999, subHeadingText) : <Skeleton height={15} width={80} />}
      </Text>
    </Flex>
  )
}

export default CardUserInfo
