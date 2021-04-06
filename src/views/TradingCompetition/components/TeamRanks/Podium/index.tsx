import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from '@pancakeswap-libs/uikit'
import TeamPodiumIcon from './TeamPodiumIcon'
import PodiumBase from '../../../svgs/PodiumBase'
import { TeamLeaderboardProps } from '../../../types'

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

const Podium: React.FC<PodiumProps> = ({ teamsSortedByVolume }) => {
  const firstTeamId = teamsSortedByVolume && teamsSortedByVolume[0].teamId
  const secondTeamId = teamsSortedByVolume && teamsSortedByVolume[1].teamId
  const thirdTeamId = teamsSortedByVolume && teamsSortedByVolume[2].teamId

  return (
    <Wrapper>
      <Flex height="132px" position="relative">
        <LeftBox>
          <TeamPodiumIcon teamId={secondTeamId} teamPosition={2} />
        </LeftBox>
        <MiddleBox>
          <TeamPodiumIcon teamId={firstTeamId} teamPosition={1} />
        </MiddleBox>
        <RightBox>
          <TeamPodiumIcon teamId={thirdTeamId} teamPosition={3} />
        </RightBox>
      </Flex>
      <PodiumBase />
    </Wrapper>
  )
}

export default Podium
