import styled from 'styled-components'
import { StaticImageData } from 'next/dist/client/image'
import { Flex, Box, Text, Skeleton, AccountFilledIcon } from '@pancakeswap/uikit'
import Image from 'next/image'
import orderBy from 'lodash/orderBy'
import { useTranslation } from '@pancakeswap/localization'
import { TeamRanksProps } from '../../types'
import useGetParticipants from './Podium/useGetParticipants'
import TopTradersCard from './TopTradersCard'
import PodiumWithParticipants from './Podium/PodiumWithParticipants'

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
    width: 292px;
    height: 234px;
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
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.card};
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 75%;
  }
`

interface TeamRanksWithParticipantsProps extends TeamRanksProps {
  image: StaticImageData
  participantSubgraphAddress: string
  subgraphName: string
}

const TeamRanksWithParticipants: React.FC<React.PropsWithChildren<TeamRanksWithParticipantsProps>> = ({
  image,
  team1LeaderboardInformation,
  team2LeaderboardInformation,
  team3LeaderboardInformation,
  globalLeaderboardInformation,
  participantSubgraphAddress,
  subgraphName,
}) => {
  const { t } = useTranslation()
  const participants = useGetParticipants(participantSubgraphAddress)

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
        <PodiumWithParticipants teamsSortedByVolume={teamsSortedByVolume} participants={participants} />
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
            <Image src={image} width={292} height={234} />
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
          subgraphName={subgraphName}
        />
      </StyledTopTradersWrapper>
    </Wrapper>
  )
}

export default TeamRanksWithParticipants
