import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, Skeleton } from '@pancakeswap-libs/uikit'
import TeamPodiumIcon from './TeamPodiumIcon'
import PodiumBase from '../../../svgs/PodiumBase'
import { TeamLeaderboardProps } from '../../../types'
import { localiseTradingVolume } from '../../../helpers'

interface PodiumProps {
  teamsSortedByVolume?: Array<TeamLeaderboardProps>
}

const Wrapper = styled(Flex)`
  flex-direction: column;
  svg {
    width: 387px;
    height: auto;
  }
`

const LeftBox = styled(Box)`
  position: absolute;
  bottom: -32px;
  left: 6px;
`

const MiddleBox = styled(Box)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translate(-50%, 0);
`

const RightBox = styled(Box)`
  position: absolute;
  bottom: -52px;
  right: 6px;
`

const StyledVolumeFlex = styled(Flex)`
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
`

const Podium: React.FC<PodiumProps> = ({ teamsSortedByVolume }) => {
  const firstTeam = teamsSortedByVolume && teamsSortedByVolume[0]
  const secondTeam = teamsSortedByVolume && teamsSortedByVolume[1]
  const thirdTeam = teamsSortedByVolume && teamsSortedByVolume[2]

  // debugger // eslint-disable-line no-debugger

  return (
    <Wrapper>
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
            <Text bold>${localiseTradingVolume(secondTeam.leaderboardData.volume)}</Text>
          ) : (
            <Skeleton width="77px" height="24px" />
          )}
          <Text fontSize="12px" color="textSubtle">
            Volume
          </Text>
        </StyledVolumeFlex>
        <StyledVolumeFlex>
          {firstTeam ? (
            <Text bold>${localiseTradingVolume(firstTeam.leaderboardData.volume)}</Text>
          ) : (
            <Skeleton width="77px" height="24px" />
          )}
          <Text fontSize="12px" color="textSubtle">
            Volume
          </Text>
        </StyledVolumeFlex>
        <StyledVolumeFlex>
          {thirdTeam ? (
            <Text bold>${localiseTradingVolume(thirdTeam.leaderboardData.volume)}</Text>
          ) : (
            <Skeleton width="77px" height="24px" />
          )}
          <Text fontSize="12px" color="textSubtle">
            Volume
          </Text>
        </StyledVolumeFlex>
      </Flex>
    </Wrapper>
  )
}

export default Podium
