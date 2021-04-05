import React from 'react'
import {
  Text,
  Heading,
  Flex,
  Skeleton,
  MedalBronzeIcon,
  MedalGoldIcon,
  MedalPurpleIcon,
  MedalSilverIcon,
  MedalTealIcon,
} from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { YourScoreProps } from '../../types'
import UserRankBox from './UserRankBox'

const TeamRankTextWrapper = styled(Flex)`
  svg {
    width: 24px;
  }
`

const CardUserInfo: React.FC<YourScoreProps> = ({ hasRegistered, account, profile, userLeaderboardInformation }) => {
  const TranslateString = useI18n()
  const { global, team, volume } = userLeaderboardInformation
  const showRanks = account && hasRegistered
  const isLoading = !userLeaderboardInformation

  const userMedal = () => {
    if (team === '???') {
      return null
    }

    if (team === 1) {
      return <MedalGoldIcon />
    }

    if (team <= 10) {
      return <MedalSilverIcon />
    }

    if (team <= 100) {
      return <MedalBronzeIcon />
    }

    if (team <= 500) {
      return <MedalPurpleIcon />
    }

    return <MedalTealIcon />
  }

  const getHeadingText = () => {
    if (!account) {
      return TranslateString(999, 'Check your Rank')
    }
    if (!hasRegistered) {
      return TranslateString(999, 'You’re not participating this time.')
    }
    return `@${profile.username}`
  }

  const getSubHeadingText = () => {
    if (!account) {
      return TranslateString(999, 'Connect wallet to view')
    }
    if (!hasRegistered) {
      return TranslateString(999, 'Sorry, you needed to register during the “entry” period!')
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
      {showRanks && (
        <Flex width="100%" mt="24px">
          <UserRankBox
            flex="1"
            title={TranslateString(999, 'Rank in team').toUpperCase()}
            footer={`${TranslateString(999, `#${!isLoading && global.toLocaleString()} Overall`)}`}
            mr="8px"
          >
            {isLoading ? (
              <Skeleton height="26px" width="110px" />
            ) : (
              <TeamRankTextWrapper>
                <Heading textAlign="center" size="lg" mr="8px">
                  #{team}
                </Heading>
                {userMedal()}
              </TeamRankTextWrapper>
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
                ${!isLoading && volume.toLocaleString()}
              </Heading>
            )}
          </UserRankBox>
        </Flex>
      )}
    </Flex>
  )
}

export default CardUserInfo
