import React from 'react'
import { Text, Flex } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { LeaderboardDataItem } from '../../../types'
import { localiseTradingVolume, accountEllipsis } from '../../../helpers'
import { LeaderboardStorm, LeaderboardFlippers, LeaderboardCakers } from '../../../svgs'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr) 3fr;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textDisabled};
  svg {
    height: 44px;
    width: auto;
  }
`

const Item = styled(Flex)`
  align-items: center;
  justify-content: center;
  /* 
  ${({ theme }) => theme.mediaQueries.xs} {
    min-width: 40px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 80px;
  } */
`

const GridItem: React.FC<{ traderData?: LeaderboardDataItem }> = ({ traderData }) => {
  const { address, volume, teamId, rank } = traderData

  const icon = {
    1: <LeaderboardStorm />,
    2: <LeaderboardFlippers />,
    3: <LeaderboardCakers />,
  }

  return (
    <Wrapper>
      <Item>
        <Text mx="16px" fontSize="16px" bold color="secondary">
          #{rank}
        </Text>
      </Item>
      <Item>
        <Text fontSize="12px" mr="16px" bold>
          ${localiseTradingVolume(volume)}
        </Text>
      </Item>
      <Item>
        <Text color="primary" mr="16px" fontSize="12px">
          {accountEllipsis(address)}
        </Text>
      </Item>
      <Flex justifyContent="flex-end">{icon[teamId]}</Flex>
    </Wrapper>
  )
}

export default GridItem
