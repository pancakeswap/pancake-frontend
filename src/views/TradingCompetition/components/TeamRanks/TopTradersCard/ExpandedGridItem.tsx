import { Box, Flex, SkeletonV2, Text, ProfileAvatar } from '@pancakeswap/uikit'
import { useProfileForAddress } from 'state/profile/hooks'
import styled from 'styled-components'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { localiseTradingVolume } from '../../../helpers'
import { LeaderboardDataItem } from '../../../types'

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

const GridItem: React.FC<React.PropsWithChildren<{ traderData?: LeaderboardDataItem; teamImages: React.ReactNode[] }>> =
  ({ traderData = { address: '', volume: 0, teamId: 0, rank: 0 }, teamImages }) => {
    const { address, volume, teamId, rank } = traderData
    const { profile, isFetching } = useProfileForAddress(address)

    return (
      <Wrapper>
        <Flex ml={['4px', '8px', '16px']} alignItems="center" justifyContent="flex-start">
          <Text fontSize="16px" bold color="secondary">
            #{rank}
          </Text>
          <SkeletonV2
            width="24px"
            height="24px"
            ml={['16px', null, '16px']}
            borderRadius="50%"
            isDataReady={!isFetching}
          >
            <ProfileAvatar src={profile?.nft?.image?.thumbnail} width={32} height={32} mr={['4px', null, '12px']} />
          </SkeletonV2>
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
