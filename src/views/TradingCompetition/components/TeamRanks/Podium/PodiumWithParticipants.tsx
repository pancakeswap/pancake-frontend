import { useTranslation } from 'contexts/Localization'
import { Flex, Text, Skeleton, AccountFilledIcon } from '@pancakeswap/uikit'
import { StyledVolumeText, PodiumProps, RightBox, MiddleBox, LeftBox, Wrapper, Inner, StyledVolumeFlex } from './styles'
import TeamPodiumIcon from './TeamPodiumIcon'
import { PodiumBase } from '../../../svgs'
import { localiseTradingVolume } from '../../../helpers'

interface MoboxPodiumProps extends PodiumProps {
  participants: string[]
}

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

const PodiumWithParticipants: React.FC<MoboxPodiumProps> = ({ teamsSortedByVolume, participants }) => {
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

export default PodiumWithParticipants
