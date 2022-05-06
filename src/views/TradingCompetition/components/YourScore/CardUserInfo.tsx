import { ReactText, ReactNode } from 'react'
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
  Button,
  useModal,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LIVE } from 'config/constants/trading-competition/phases'
import { YourScoreProps } from '../../types'
import UserRankBox from './UserRankBox'
import NextRankBox from './NextRankBox'
import { localiseTradingVolume } from '../../helpers'

const TeamRankTextWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
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

interface CardUserInfoProps extends YourScoreProps {
  shareModal: ReactNode
  extraUserRankBox?: ReactNode
}

const CardUserInfo: React.FC<CardUserInfoProps> = ({
  shareModal,
  extraUserRankBox,
  hasRegistered,
  account,
  profile,
  userLeaderboardInformation,
  currentPhase,
}) => {
  const { t } = useTranslation()
  const [onPresentShareModal] = useModal(shareModal, false)
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
      return t('Check your Rank')
    }
    if (!hasRegistered) {
      return t('You’re not participating this time.')
    }
    return profile ? `@${profile.username}` : ''
  }

  const getSubHeadingText = () => {
    if (!account) {
      return t('Connect wallet to view')
    }
    if (!hasRegistered) {
      return t('Sorry, you needed to register during the “entry” period!')
    }
    return profile && profile.team ? `${profile.team.name}` : ''
  }

  const headingText = getHeadingText()
  const subHeadingText = getSubHeadingText()
  const nextTier = userLeaderboardInformation && getNextTier(team)
  const medal = userLeaderboardInformation && getMedal(team)

  return (
    <Flex flexDirection="column" alignItems="center" mt="16px">
      <Heading scale="lg" textAlign="center">
        {headingText}
      </Heading>
      <Text textAlign="center" fontSize="14px" color="textSubtle" mt="4px">
        {subHeadingText}
      </Text>
      {shouldShowUserRanks && (
        <>
          {profile?.nft && volume > 0 && (
            <Button mt="12px" variant="secondary" scale="sm" onClick={onPresentShareModal}>
              {t('Share Score')}
            </Button>
          )}
          <RanksWrapper>
            <Flex width="100%" flexDirection={['column', null, null, 'row']} mr={['8px', null, null, 0]}>
              {volume > 0 && (
                <UserRankBox
                  flex="1"
                  title={t('Rank in team').toUpperCase()}
                  footer={userLeaderboardInformation ? t('#%global% Overall', { global: global.toLocaleString() }) : ''}
                  mr={[0, null, null, '8px']}
                  mb={['8px', null, null, 0]}
                >
                  {!userLeaderboardInformation ? (
                    <Skeleton height="26px" width="110px" />
                  ) : (
                    <TeamRankTextWrapper>
                      <Heading textAlign="center" scale="lg" mr="8px">
                        #{team}
                      </Heading>
                      {medal.current}
                    </TeamRankTextWrapper>
                  )}
                </UserRankBox>
              )}
              <UserRankBox
                flex="1"
                title={t('Your volume').toUpperCase()}
                footer={t('Since start')}
                // Add responsive mr if competition is LIVE
                mr={currentPhase.state === LIVE ? [0, null, null, '8px'] : 0}
                mb={['8px', null, null, 0]}
              >
                {!userLeaderboardInformation ? (
                  <Skeleton height="26px" width="110px" />
                ) : (
                  <Heading textAlign="center" scale="lg">
                    ${userLeaderboardInformation && localiseTradingVolume(volume)}
                  </Heading>
                )}
              </UserRankBox>
              {extraUserRankBox || null}
            </Flex>
            {/* Show next ranks if competition is LIVE */}
            {currentPhase.state === LIVE &&
              (team === 1 ? (
                // If user is first
                <NextRankBox
                  flex="2"
                  title={t('Your tier: gold').toUpperCase()}
                  footer={t('Love, The Chefs x')}
                  currentMedal={medal.current}
                  hideArrow
                >
                  <Heading scale="lg">{t('HECK YEAH!')}</Heading>
                </NextRankBox>
              ) : (
                <NextRankBox
                  flex="2"
                  title={`${t('Next tier').toUpperCase()}: ${nextTier.color}`}
                  footer={t('to become #%rank% in team', { rank: nextTier.rank })}
                  currentMedal={medal.current}
                  nextMedal={medal.next}
                >
                  <Heading scale="lg">+${userLeaderboardInformation && localiseTradingVolume(nextRank)}</Heading>
                </NextRankBox>
              ))}
          </RanksWrapper>
        </>
      )}
    </Flex>
  )
}

export default CardUserInfo
