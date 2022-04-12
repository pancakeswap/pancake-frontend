import styled from 'styled-components'
import { Flex, Box, Text, Skeleton, AccountFilledIcon } from '@pancakeswap/uikit'
import Image from 'next/image'
import orderBy from 'lodash/orderBy'
import { useTranslation } from 'contexts/Localization'
import { TeamRanksProps } from '../../types'
import CakerBunny from '../../pngs/cakers.png'
import TopTradersCard from './TopTradersCard'
import Podium from './Podium'
import useGetParticipants from './Podium/useGetParticipants'

const Wrapper = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const StyledPodiumWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
    margin-right: 40px;
    margin-bottom: 0;
  }
`

const BunnyImageWrapper = styled(Box)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    width: 200px;
    height: 205px;
  }
`

const StyledTopTradersWrapper = styled(Flex)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2;
  }
`

const TotalParticipantsWrapper = styled(Box)`
  position: relative;
  width: 100%;
  ${BunnyImageWrapper} {
    position: absolute;
    top: 50%;
    right: 0;
  }
`

const TotalParticipantsCloud = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.card};
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 75%;
  }
`

const TeamRanks: React.FC<TeamRanksProps> = ({
  team1LeaderboardInformation,
  team2LeaderboardInformation,
  team3LeaderboardInformation,
  globalLeaderboardInformation,
}) => {
  const { t } = useTranslation()
  const participants = useGetParticipants()

  const isTeamLeaderboardDataComplete = Boolean(
    team1LeaderboardInformation.leaderboardData &&
      team2LeaderboardInformation.leaderboardData &&
      team3LeaderboardInformation.leaderboardData,
  )

  const isGlobalLeaderboardDataComplete = Boolean(isTeamLeaderboardDataComplete && globalLeaderboardInformation)

  const getTeamsSortedByVolume = (arrayOfTeams) => {
    return orderBy(arrayOfTeams, (team) => team.leaderboardData.volume, 'desc')
  }

  const teamsSortedByVolume =
    isTeamLeaderboardDataComplete &&
    getTeamsSortedByVolume([team1LeaderboardInformation, team2LeaderboardInformation, team3LeaderboardInformation])

  return (
    <Wrapper>
      <StyledPodiumWrapper>
        <Podium teamsSortedByVolume={teamsSortedByVolume} participants={participants} />
        <TotalParticipantsWrapper>
          <TotalParticipantsCloud flexDirection="column" mt="24px" justifySelf="flex-start">
            <Text color="secondary" fontSize="24px" bold>
              {t('Total Participants')}
            </Text>
            <Flex>
              <AccountFilledIcon height="24px" />
              {participants[3] ? (
                <Text fontSize="24px" bold>
                  {participants[3]}
                </Text>
              ) : (
                <Skeleton height="24px" width="120px" />
              )}
            </Flex>
          </TotalParticipantsCloud>
          <BunnyImageWrapper mt="24px">
            <Image src={CakerBunny} width={200} height={205} />
          </BunnyImageWrapper>
        </TotalParticipantsWrapper>
      </StyledPodiumWrapper>
      <StyledTopTradersWrapper>
        <TopTradersCard
          team1LeaderboardInformation={team1LeaderboardInformation}
          team2LeaderboardInformation={team2LeaderboardInformation}
          team3LeaderboardInformation={team3LeaderboardInformation}
          globalLeaderboardInformation={globalLeaderboardInformation}
          isGlobalLeaderboardDataComplete={isGlobalLeaderboardDataComplete}
        />
      </StyledTopTradersWrapper>
    </Wrapper>
  )
}

export default TeamRanks
