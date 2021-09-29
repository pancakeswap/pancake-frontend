import React from 'react'
import styled from 'styled-components'
import { Box, Flex, BunnyPlaceholderIcon, Skeleton, Text } from '@pancakeswap/uikit'
import truncateHash from 'utils/truncateHash'
import { useGetProfileAvatar } from 'state/profile/hooks'
import { ProfileAvatarFetchStatus } from 'state/types'
import { Link } from 'react-router-dom'
import { nftsBaseUrl } from '../constants'

const Avatar = styled.img`
  margin-right: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 12px;
  }
`

const StyledFlex = styled(Flex)`
  align-items: center;
  transition: opacity 200ms ease-in;

  &:hover {
    opacity: 0.5;
  }
`

const ProfileCell: React.FC<{ accountAddress: string }> = ({ accountAddress }) => {
  const { username, nft: profileNft, usernameFetchStatus, avatarFetchStatus } = useGetProfileAvatar(accountAddress)
  const profileName = username || '-'

  let sellerProfilePicComponent = <Skeleton width="32px" height="32px" mr={['4px', null, '12px']} />
  if (avatarFetchStatus === ProfileAvatarFetchStatus.FETCHED) {
    if (profileNft?.images?.sm) {
      sellerProfilePicComponent = <Avatar src={`/images/nfts/${profileNft?.images?.md}`} />
    } else {
      sellerProfilePicComponent = <BunnyPlaceholderIcon width="32px" height="32px" mr={['4px', null, '12px']} />
    }
  }

  return (
    <Link to={`${nftsBaseUrl}/profile/${accountAddress}`}>
      <StyledFlex>
        {sellerProfilePicComponent}
        <Box display="inline">
          <Text lineHeight="1.25">{truncateHash(accountAddress)}</Text>
          {usernameFetchStatus !== ProfileAvatarFetchStatus.FETCHED ? (
            <Skeleton />
          ) : (
            <Text lineHeight="1.25">{profileName}</Text>
          )}
        </Box>
      </StyledFlex>
    </Link>
  )
}

export default ProfileCell
