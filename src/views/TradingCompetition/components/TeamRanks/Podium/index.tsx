import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import TeamPodiumIcon from './TeamPodiumIcon'
import { TeamLeaderboardProps } from '../../../types'

interface PodiumProps {
  teamsSortedByVolume?: Array<TeamLeaderboardProps>
}

const Podium: React.FC<PodiumProps> = ({ teamsSortedByVolume }) => {
  return (
    <Flex>
      <TeamPodiumIcon teamId={2} teamPosition={2} />
      <TeamPodiumIcon teamId={1} teamPosition={1} />
      <TeamPodiumIcon teamId={3} teamPosition={3} />
    </Flex>
  )
}

export default Podium
