import React from 'react'
import { Heading, Text, Flex } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { LeaderboardDataItem } from '../../../types'
import { localiseTradingVolume, accountEllipsis } from '../../../helpers'

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: auto repeat(3, 1fr);
  border-bottom: 1px solid ${({ theme }) => theme.colors.textDisabled};
  grid-gap: 4px;

  svg {
    height: 55px;
    width: auto;
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-gap: 8px;

    svg {
      height: 65px;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(4, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: auto repeat(3, 1fr);
    grid-gap: 16px;

    svg {
      height: 72px;
    }
  }

  /* Between 968 - 1080px the team image is absolute positioned so it becomes a 3-column grid */
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: auto auto 1fr;
    min-height: 72px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const TeamImageWrapper = styled(Flex)`
  /* Between 968 - 1080px the grid is narrow so absolute position the team image */
  ${({ theme }) => theme.mediaQueries.lg} {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    position: relative;
  }
`

const GridItem: React.FC<{
  traderData?: LeaderboardDataItem
  teamImages: React.ReactNode[]
}> = ({ traderData = { address: '', volume: 0, teamId: 0, rank: 0 }, teamImages }) => {
  const { address, volume, teamId, rank } = traderData

  return (
    <Wrapper>
      <Flex ml={['4px', '8px', '16px']} alignItems="center" justifyContent="flex-start">
        <Heading color="secondary">#{rank}</Heading>
      </Flex>
      <Flex alignItems="center" justifyContent="flex-start">
        <Text bold>${localiseTradingVolume(volume)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="flex-start">
        <Text color="primary">{accountEllipsis(address)}</Text>
      </Flex>
      <TeamImageWrapper justifyContent="flex-end">{teamImages[teamId - 1]}</TeamImageWrapper>
    </Wrapper>
  )
}

export default GridItem
