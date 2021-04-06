import React from 'react'
import { Heading, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { LeaderboardDataItem } from '../../../types'
import { localiseTradingVolume, accountEllipsis } from '../../../helpers'
import { LeaderboardStorm, LeaderboardFlippers, LeaderboardCakers } from '../../../svgs'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  svg {
    height: 80px;
    width: auto;
  }
`

const GridItem: React.FC<{ traderData?: LeaderboardDataItem }> = ({ traderData }) => {
  //   debugger // eslint-disable-line

  const { rank, address, volume, teamId } = traderData

  const icon = {
    1: <LeaderboardStorm />,
    2: <LeaderboardFlippers />,
    3: <LeaderboardCakers />,
  }

  //   accountEllipsis
  return (
    <Grid>
      <Heading>#{rank}</Heading>
      <Text>${localiseTradingVolume(volume)}</Text>
      <Text>{accountEllipsis(address)}</Text>
      {icon[teamId]}
    </Grid>
  )
}

export default GridItem
