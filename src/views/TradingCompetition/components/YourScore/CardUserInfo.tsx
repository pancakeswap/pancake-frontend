import React, { ReactText } from 'react'
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
  BlockIcon,
} from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { YourScoreProps } from '../../types'
import UserRankBox from './UserRankBox'
import NextRankBox from './NextRankBox'
import { localiseTradingVolume } from '../../helpers'

const TeamRankTextWrapper = styled(Flex)`
  svg {
    width: 24px;
  }
`

const RanksWrapper = styled(Flex)`
  width: 100%;
  margin-top: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const CardUserInfo: React.FC<YourScoreProps> = ({ hasRegistered, account, profile, userLeaderboardInformation }) => {
  const TranslateString = useI18n()
  const { global, team, volume, next_rank: nextRank } = userLeaderboardInformation
  const shouldShowUserRanks = account && hasRegistered

  const getMedal = (currentRank: ReactText) => {
    if (currentRank === 1) {
      return {
        current: <MedalGoldIcon />,
        next: null,
      }
    }
    if (currentRank <= 10) {
      return {
        current: <MedalSilverIcon />,
        next: <MedalGoldIcon />,
      }
    }
    if (currentRank <= 100) {
      return {
        current: <MedalBronzeIcon />,
        next: <MedalSilverIcon />,
      }
    }
    if (currentRank <= 500) {
      return {
        current: <MedalPurpleIcon />,
        next: <MedalBronzeIcon />,
      }
    }
    if (currentRank > 500) {
      return {
        current: <MedalTealIcon />,
        next: <MedalPurpleIcon />,
      }
    }
    return {
      current: <BlockIcon />,
      next: <MedalTealIcon />,
    }
  }

  const getNextTier = (currentRank: ReactText) => {
    if (currentRank === 1) {
      return {
        color: null,
        rank: null,
      }
    }
    if (currentRank <= 10) {
      return {
        color: 'GOLD',
        rank: 1,
      }
    }
    if (currentRank <= 100) {
      return {
        color: 'SILVER',
        rank: 10,
      }
    }
    if (currentRank <= 500) {
      return {
        color: 'BRONZE',
        rank: 100,
      }
    }
    if (currentRank > 500) {
      return {
        color: 'PURPLE',
        rank: 500,
      }
    }
    return {
      color: '',
      rank: 500,
    }
  }

  const getHeadingText = () => {
    if (!account) {
      return TranslateString(1218, 'Check your Rank')
    }
    if (!hasRegistered) {
      return TranslateString(1220, 'You’re not participating this time.')
    }
    return `@${profile.username}`
  }

  const getSubHeadingText = () => {
    if (!account) {
      return TranslateString(1214, 'Connect wallet to view')
    }
    if (!hasRegistered) {
      return TranslateString(1216, 'Sorry, you needed to register during the “entry” period!')
    }
    return `${profile.team.name}`
  }

  const headingText = getHeadingText()
  const subHeadingText = getSubHeadingText()
  const nextTier = userLeaderboardInformation && getNextTier(team)
  const medal = userLeaderboardInformation && getMedal(team)

  return (
    <Flex flexDirection="column" alignItems="center" mt="16px">
      <Heading size="lg" textAlign="center">
        {headingText}
      </Heading>
      <Text textAlign="center" fontSize="14px" color="textSubtle" mt="4px">
        {subHeadingText}
      </Text>
      {shouldShowUserRanks && (
        <RanksWrapper>
          <Flex>
            {volume > 0 ? (
              <UserRankBox
                flex="1"
                title={TranslateString(1222, 'Rank in team').toUpperCase()}
                footer={`${TranslateString(999, `#${userLeaderboardInformation && global.toLocaleString()} Overall`)}`}
                mr="8px"
              >
                {!userLeaderboardInformation ? (
                  <Skeleton height="26px" width="110px" />
                ) : (
                  <TeamRankTextWrapper>
                    <Heading textAlign="center" size="lg" mr="8px">
                      #{team}
                    </Heading>
                    {medal.current}
                  </TeamRankTextWrapper>
                )}
              </UserRankBox>
            ) : null}
            <UserRankBox
              flex="1"
              title={TranslateString(1224, 'Your volume').toUpperCase()}
              footer={TranslateString(1226, 'Since start')}
              mr={{ _: '0', sm: '8px' }}
            >
              {!userLeaderboardInformation ? (
                <Skeleton height="26px" width="110px" />
              ) : (
                <Heading textAlign="center" size="lg">
                  ${userLeaderboardInformation && localiseTradingVolume(volume)}
                </Heading>
              )}
            </UserRankBox>
          </Flex>
          {team === 1 ? (
            // If user is first
            <NextRankBox
              flex="2"
              title={`${TranslateString(999, 'Your tier: gold').toUpperCase()}`}
              footer={`${TranslateString(999, 'Love, The Chefs x')}`}
              currentMedal={medal.current}
              hideArrow
            >
              <Heading size="lg">{TranslateString(999, 'HECK YES!')}</Heading>
            </NextRankBox>
          ) : (
            <NextRankBox
              flex="2"
              title={`${TranslateString(999, 'Next tier').toUpperCase()}: ${nextTier.color}`}
              footer={`${TranslateString(999, 'to become')} #${nextTier.rank} ${TranslateString(999, 'in team')}`}
              currentMedal={medal.current}
              nextMedal={medal.next}
            >
              <Heading size="lg">+${userLeaderboardInformation && localiseTradingVolume(nextRank)}</Heading>
            </NextRankBox>
          )}
        </RanksWrapper>
      )}
    </Flex>
  )
}

export default CardUserInfo
