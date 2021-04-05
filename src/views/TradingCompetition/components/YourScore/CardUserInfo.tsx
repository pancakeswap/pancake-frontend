import React from 'react'
import { Text, Heading, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { YourScoreProps } from '../../types'
import UserRank from './UserRank'

const CardUserInfo: React.FC<YourScoreProps> = ({ hasRegistered, account, profile }) => {
  const TranslateString = useI18n()

  const getHeadingText = () => {
    if (!account) {
      return 'Check your Rank'
    }
    if (!hasRegistered) {
      return 'You’re not participating this time.'
    }
    return `@${profile.username}`
  }

  const getSubHeadingText = () => {
    if (!account) {
      return 'Connect wallet to view'
    }
    if (!hasRegistered) {
      return 'Sorry, you needed to register during the “entry” period!'
    }
    return `${profile.team.name}`
  }

  const headingText = getHeadingText()
  const subHeadingText = getSubHeadingText()

  return (
    <Flex flexDirection="column" alignItems="center" mt="16px">
      <Heading size="lg" textAlign="center">
        {TranslateString(999, headingText)}
      </Heading>
      <Text textAlign="center" fontSize="14px" color="textSubtle" mt="4px">
        {TranslateString(999, subHeadingText)}
      </Text>
      <Flex width="100%" mt="24px">
        <UserRank
          flex="1"
          title={TranslateString(999, 'Rank in team')}
          footer={`somenum ${TranslateString(999, 'Overall')}`}
          mr="8px"
        >
          A num
        </UserRank>
        <UserRank flex="1" title={TranslateString(999, 'Your volume')} footer={TranslateString(999, 'Since start')}>
          A num
        </UserRank>
      </Flex>
    </Flex>
  )
}

export default CardUserInfo
