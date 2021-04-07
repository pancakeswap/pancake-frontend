import React from 'react'
import { Heading, Text, Flex } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { LeaderboardDataItem } from '../../../types'
import { localiseTradingVolume, accountEllipsis } from '../../../helpers'
import { LeaderboardStorm, LeaderboardFlippers, LeaderboardCakers } from '../../../svgs'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto repeat(3, 1fr);
  border-bottom: 1px solid ${({ theme }) => theme.colors.textDisabled};
  svg {
    height: 80px;
    width: auto;
  }
`

const Item = styled(Flex)`
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.xs} {
    min-width: 40px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 80px;
  }
`

const GridItem: React.FC<{ traderData?: LeaderboardDataItem; index: number }> = ({ traderData, index }) => {
  // reinstate 'rank' instead of index when rank is accurate
  const { address, volume, teamId } = traderData

  const icon = {
    1: <LeaderboardStorm />,
    2: <LeaderboardFlippers />,
    3: <LeaderboardCakers />,
  }

  return (
    <Wrapper>
      <Item>
        <Heading color="secondary">#{index + 1}</Heading>
      </Item>
      <Item>
        <Text bold>${localiseTradingVolume(volume)}</Text>
      </Item>
      <Item>
        <Text color="primary">{accountEllipsis(address)}</Text>
      </Item>
      {icon[teamId]}
    </Wrapper>
  )
}

export default GridItem
