import React from 'react'
import { Text, Flex } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { LeaderboardDataItem } from '../../../types'
import { localiseTradingVolume, accountEllipsis } from '../../../helpers'
import { LeaderboardStorm, LeaderboardFlippers, LeaderboardCakers } from '../../../svgs'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr) 3fr;
  grid-gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textDisabled};
  svg {
    height: 44px;
    width: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }
`

const RankItem = styled(Flex)`
  margin-left: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
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
      <RankItem alignItems="center" justifyContent="flex-start">
        <Text fontSize="16px" bold color="secondary">
          #{rank}
        </Text>
      </RankItem>
      <Flex alignItems="center" justifyContent="flex-start">
        <Text fontSize="12px" bold>
          ${localiseTradingVolume(volume)}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="flex-start">
        <Text color="primary" fontSize="12px">
          {accountEllipsis(address)}
        </Text>
      </Flex>
      <Flex justifyContent="flex-end">{icon[teamId]}</Flex>
    </Wrapper>
  )
}

export default GridItem
