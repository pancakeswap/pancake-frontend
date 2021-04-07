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
  grid-gap: 8px;

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 16px;
  }

  svg {
    height: 80px;
    width: auto;
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
        <Heading color="secondary">#{rank}</Heading>
      </RankItem>
      <Flex alignItems="center" justifyContent="flex-start">
        <Text bold>${localiseTradingVolume(volume)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="flex-start">
        <Text color="primary">{accountEllipsis(address)}</Text>
      </Flex>
      {icon[teamId]}
    </Wrapper>
  )
}

export default GridItem
