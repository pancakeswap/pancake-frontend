import { Text, Flex, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'
import truncateHash from 'utils/truncateHash'
import { LeaderboardDataItem } from '../../../types'
import { localiseTradingVolume } from '../../../helpers'

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

const TeamImageWrapper = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.xl} {
    position: absolute;
    right: 0;
    bottom: 0;
  }
`

const GridItem: React.FC<{ traderData?: LeaderboardDataItem; teamImages: React.ReactNode[] }> = ({
  traderData = { address: '', volume: 0, teamId: 0, rank: 0 },
  teamImages,
}) => {
  const { address, volume, teamId, rank } = traderData

  return (
    <Wrapper>
      <Flex ml={['4px', '8px', '16px']} alignItems="center" justifyContent="flex-start">
        <Text fontSize="16px" bold color="secondary">
          #{rank}
        </Text>
      </Flex>
      <VolumeAddressWrapper>
        <Flex alignItems="center" justifyContent="flex-start">
          <VolumeText fontSize="12px" bold>
            ${localiseTradingVolume(volume)}
          </VolumeText>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-start">
          <Text color="primary" fontSize="12px">
            {truncateHash(address)}
          </Text>
        </Flex>
      </VolumeAddressWrapper>
      <TeamImageWrapper justifyContent="flex-end">{teamImages[teamId - 1]}</TeamImageWrapper>
    </Wrapper>
  )
}

export default GridItem
