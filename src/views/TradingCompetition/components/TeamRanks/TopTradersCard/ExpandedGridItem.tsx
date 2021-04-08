import React from 'react'
import { Text, Flex, Box } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { LeaderboardDataItem } from '../../../types'
import { localiseTradingVolume, accountEllipsis } from '../../../helpers'
import { LeaderboardStorm, LeaderboardFlippers, LeaderboardCakers } from '../../../svgs'

const Wrapper = styled.div`
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textDisabled};
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 4fr auto;

  /* Between 576 - 852px - the expanded wrapper shows as a three-column grid */
  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 4px;
    grid-template-columns: auto 1fr auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 16px;
    grid-template-columns: 1fr 4fr auto;
  }

  /* Above 1080px - the expanded wrapper shows as a three-column grid. */
  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: auto 1fr;
    min-height: 44px;
  }

  svg {
    height: 44px;
    width: auto;
  }
`

const RankItem = styled(Flex)`
  margin-left: 4px;

  ${({ theme }) => theme.mediaQueries.xs} {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-left: 16px;
  }
`

const VolumeAddressWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 2fr;

  /* Between 576 - 852px - the expanded wrapper shows as a three-column grid and these elements are stacked */
  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: grid;
  }

  /* Above 1080px - the expanded wrapper shows as a three-column grid and these elements are stacked */
  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
  }
`

const VolumeText = styled(Text)`
  margin-right: 8px;

  /* Between 576 - 852px the expanded wrapper shows as a three-column grid */
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 16px;
  }

  /* Above 1080px - the expanded wrapper shows as a three-column grid */
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 0;
  }
`

const IconWrapper = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.xl} {
    position: absolute;
    right: 0;
    bottom: 0;
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
      <VolumeAddressWrapper>
        <Flex alignItems="center" justifyContent="flex-start">
          <VolumeText fontSize="12px" bold>
            ${localiseTradingVolume(volume)}
          </VolumeText>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-start">
          <Text color="primary" fontSize="12px">
            {accountEllipsis(address)}
          </Text>
        </Flex>
      </VolumeAddressWrapper>
      <IconWrapper justifyContent="flex-end">{icon[teamId]}</IconWrapper>
    </Wrapper>
  )
}

export default GridItem
