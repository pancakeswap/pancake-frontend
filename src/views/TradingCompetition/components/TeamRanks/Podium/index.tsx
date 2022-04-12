import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Flex, Box, Text, Skeleton, AccountFilledIcon } from '@pancakeswap/uikit'
import TeamPodiumIcon from './TeamPodiumIcon'
import { PodiumBase } from '../../../svgs'
import { TeamLeaderboardProps } from '../../../types'
import { localiseTradingVolume } from '../../../helpers'

interface PodiumProps {
  teamsSortedByVolume?: Array<TeamLeaderboardProps>
  participants: string[]
}

const Wrapper = styled(Flex)`
  width: 260px;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 320px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 387px;
  }
`

const Inner = styled(Flex)`
  width: 100%;
  flex-direction: column;

  svg {
    height: auto;
    width: 100%;
  }
`

const LeftBox = styled(Box)`
  position: absolute;
  bottom: -24px;
  left: 6px;

  ${({ theme }) => theme.mediaQueries.xs} {
    bottom: -26px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: -32px;
  }
`

const MiddleBox = styled(Box)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translate(-50%, 0);
`

const RightBox = styled(Box)`
  position: absolute;
  bottom: -34px;
  right: 6px;

  ${({ theme }) => theme.mediaQueries.xs} {
    bottom: -40px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    bottom: -52px;
  }
`

const StyledVolumeFlex = styled(Flex)`
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
`

const StyledVolumeText = styled(Text)`
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 14px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }
`

const ParticipantBox = ({ participants, t }) => {
  return (
    <>
      {participants ? (
        <Flex justifyContent="center">
          {/* not as height prop because Inner wins priority with auto */}
          <AccountFilledIcon style={{ height: '24px', width: '24px' }} />
          <StyledVolumeText bold>{participants}</StyledVolumeText>
        </Flex>
      ) : (
        <Skeleton width="77px" height="24px" />
      )}
      <Text fontSize="12px" color="textSubtle">
        {t('Participants')}
      </Text>
    </>
  )
}

const Podium: React.FC<PodiumProps> = ({ teamsSortedByVolume, participants }) => {
  const { t } = useTranslation()
  const firstTeam = teamsSortedByVolume && teamsSortedByVolume[0]
  const secondTeam = teamsSortedByVolume && teamsSortedByVolume[1]
  const thirdTeam = teamsSortedByVolume && teamsSortedByVolume[2]

  const firstTeamParticipants = participants[firstTeam.teamId - 1]
  const secondTeamParticipants = participants[secondTeam.teamId - 1]
  const thirdTeamParticipants = participants[thirdTeam.teamId - 1]

  return (
    <Wrapper>
      <Inner>
        <Flex height="132px" position="relative">
          <LeftBox>
            <TeamPodiumIcon teamId={secondTeam && secondTeam.teamId} teamPosition={2} />
          </LeftBox>
          <MiddleBox>
            <TeamPodiumIcon teamId={firstTeam && firstTeam.teamId} teamPosition={1} />
          </MiddleBox>
          <RightBox>
            <TeamPodiumIcon teamId={thirdTeam && thirdTeam.teamId} teamPosition={3} />
          </RightBox>
        </Flex>
        <PodiumBase />
        <Flex justifyContent="space-between" mt="8px">
          <StyledVolumeFlex>
            {secondTeam ? (
              <StyledVolumeText bold>${localiseTradingVolume(secondTeam.leaderboardData.volume)}</StyledVolumeText>
            ) : (
              <Skeleton width="77px" height="24px" />
            )}
            <Text mb="16px" fontSize="12px" color="textSubtle">
              {t('Volume')}
            </Text>
            <ParticipantBox participants={secondTeamParticipants} t={t} />
          </StyledVolumeFlex>
          <StyledVolumeFlex>
            {firstTeam ? (
              <StyledVolumeText bold>${localiseTradingVolume(firstTeam.leaderboardData.volume)}</StyledVolumeText>
            ) : (
              <Skeleton width="77px" height="24px" />
            )}
            <Text mb="16px" fontSize="12px" color="textSubtle">
              {t('Volume')}
            </Text>
            <ParticipantBox participants={firstTeamParticipants} t={t} />
          </StyledVolumeFlex>
          <StyledVolumeFlex>
            {thirdTeam ? (
              <StyledVolumeText bold>${localiseTradingVolume(thirdTeam.leaderboardData.volume)}</StyledVolumeText>
            ) : (
              <Skeleton width="77px" height="24px" />
            )}
            <Text mb="16px" fontSize="12px" color="textSubtle">
              {t('Volume')}
            </Text>
            <ParticipantBox participants={thirdTeamParticipants} t={t} />
          </StyledVolumeFlex>
        </Flex>
      </Inner>
    </Wrapper>
  )
}

export default Podium
