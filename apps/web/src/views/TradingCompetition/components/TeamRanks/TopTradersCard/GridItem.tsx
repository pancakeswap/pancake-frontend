import { Flex, Heading, Text, SkeletonV2, ProfileAvatar } from '@pancakeswap/uikit'
import { useProfileForAddress } from 'state/profile/hooks'
import styled from 'styled-components'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { localiseTradingVolume } from '../../../helpers'
import { LeaderboardDataItem } from '../../../types'

const Wrapper = styled.div`
  position: relative;
  display: grid;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textDisabled};
  grid-gap: 4px;

  svg {
    height: 55px;
    width: auto;
  }

  /* Between 0 - 370px the team image is absolutely positioned so it starts as a 3-column grid */
  grid-template-columns: repeat(3, auto);
  min-height: 55px;

  ${({ theme }) => theme.mediaQueries.xs} {
    grid-template-columns: auto repeat(3, 1fr);
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

  /* Between 968 - 1080px the team image is absolute positioned so it returns to a 3-column grid */
  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: auto auto 1fr;
    min-height: 72px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const TeamImageWrapper = styled(Flex)`
  /* Between 0 - 370px the grid is narrow so absolute position the team image */
  position: absolute;
  right: 0;
  bottom: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    position: relative;
  }

  /* Between 968 - 1080px the grid is narrow so absolute position the team image */
  ${({ theme }) => theme.mediaQueries.lg} {
    position: absolute;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    position: relative;
  }
`

const GridItem: React.FC<
  React.PropsWithChildren<{
    traderData?: LeaderboardDataItem
    teamImages: React.ReactNode[]
  }>
> = ({ traderData = { address: '', volume: 0, teamId: 0, rank: 0 }, teamImages }) => {
  const { address, volume, teamId, rank } = traderData
  const { profile, isFetching } = useProfileForAddress(address)

  return (
    <Wrapper>
      <Flex ml={['4px', '8px', '16px']} alignItems="center" justifyContent="flex-start">
        <Heading color="secondary">#{rank}</Heading>
      </Flex>
      <Flex alignItems="center" justifyContent="flex-start">
        <Text bold>${localiseTradingVolume(volume)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="flex-start">
        <SkeletonV2 width="32px" height="32px" mr={['4px', null, '12px']} borderRadius="50%" isDataReady={!isFetching}>
          <ProfileAvatar src={profile?.nft?.image?.thumbnail} width={32} height={32} mr={['4px', null, '12px']} />
        </SkeletonV2>
        <Text color="primary">{truncateHash(address)}</Text>
      </Flex>
      <TeamImageWrapper justifyContent="flex-end">{teamImages[teamId - 1]}</TeamImageWrapper>
    </Wrapper>
  )
}

export default GridItem
