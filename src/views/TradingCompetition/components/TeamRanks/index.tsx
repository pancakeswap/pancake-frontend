import styled from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import Image from 'next/image'
import orderBy from 'lodash/orderBy'
import { TeamRanksProps } from '../../types'
import CakerBunny from '../../pngs/cakers.png'
import TopTradersCard from './TopTradersCard'
import Podium from './Podium'

const Wrapper = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const StyledPodiumWrapper = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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

const TeamRanks: React.FC<TeamRanksProps> = ({
  team1LeaderboardInformation,
  team2LeaderboardInformation,
  team3LeaderboardInformation,
  globalLeaderboardInformation,
}) => {
  const isTeamLeaderboardDataComplete = Boolean(
    team1LeaderboardInformation.leaderboardData &&
      team2LeaderboardInformation.leaderboardData &&
      team3LeaderboardInformation.leaderboardData,
  )

  const isGlobalLeaderboardDataComplete = Boolean(isTeamLeaderboardDataComplete && globalLeaderboardInformation)

  const getTeamsSortedByVolume = (arrayOfTeams) => {
    return orderBy(arrayOfTeams, (team) => team.leaderboardData.volume, 'desc')
  }

  return (
    <Wrapper>
      <StyledPodiumWrapper>
        <Podium
          teamsSortedByVolume={
            isTeamLeaderboardDataComplete &&
            getTeamsSortedByVolume([
              team1LeaderboardInformation,
              team2LeaderboardInformation,
              team3LeaderboardInformation,
            ])
          }
        />
        <BunnyImageWrapper mt="24px">
          <Image src={CakerBunny} width={200} height={205} />
        </BunnyImageWrapper>
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
