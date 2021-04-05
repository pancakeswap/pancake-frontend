import React from 'react'
import { Text, Heading, Flex, Skeleton } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { YourScoreProps } from '../../types'
import UserRankBox from './UserRankBox'

const CardUserInfo: React.FC<YourScoreProps> = ({ hasRegistered, account, profile, userLeaderboardInformation }) => {
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
  const showRanks = account && hasRegistered
  const isLoading = !userLeaderboardInformation

  return (
    <Flex flexDirection="column" alignItems="center" mt="16px">
      <Heading size="lg" textAlign="center">
        {TranslateString(999, headingText)}
      </Heading>
      <Text textAlign="center" fontSize="14px" color="textSubtle" mt="4px">
        {TranslateString(999, subHeadingText)}
      </Text>
      {showRanks && (
        <Flex width="100%" mt="24px">
          <UserRankBox
            flex="1"
            title={TranslateString(999, 'Rank in team').toUpperCase()}
            footer={`${TranslateString(
              999,
              `#${!isLoading && userLeaderboardInformation.global.toLocaleString()} Overall`,
            )}`}
            mr="8px"
          >
            {isLoading ? (
              <Skeleton height="26px" width="110px" />
            ) : (
              <Heading textAlign="center" size="lg">
                {userLeaderboardInformation.team} ico
              </Heading>
            )}
          </UserRankBox>
          <UserRankBox
            flex="1"
            title={TranslateString(999, 'Your volume').toUpperCase()}
            footer={TranslateString(999, 'Since start')}
          >
            {isLoading ? (
              <Skeleton height="26px" width="110px" />
            ) : (
              <Heading textAlign="center" size="lg">
                ${!isLoading && userLeaderboardInformation.volume.toLocaleString()}
              </Heading>
            )}
          </UserRankBox>
        </Flex>
      )}
    </Flex>
  )
}

export default CardUserInfo
