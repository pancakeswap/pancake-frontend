import React from 'react'
import { Text, Flex, Box } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { LeaderboardDataItem } from '../../../types'
import { localiseTradingVolume, accountEllipsis } from '../../../helpers'
import { LeaderboardStorm, LeaderboardFlippers, LeaderboardCakers } from '../../../svgs'

const Wrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.textDisabled};
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 4fr auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 4px;
    grid-template-columns: auto 1fr auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 16px;
    grid-template-columns: 1fr 4fr auto;
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

  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 2fr;
    display: grid;
  }
`

const VolumeText = styled(Text)`
  margin-right: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    margin-right: 0;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 16px;
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
      <Flex justifyContent="flex-end">{icon[teamId]}</Flex>
    </Wrapper>
  )
}

export default GridItem
