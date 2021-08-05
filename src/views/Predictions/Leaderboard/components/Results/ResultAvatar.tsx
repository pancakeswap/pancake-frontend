import React from 'react'
import { Box, Flex, FlexProps, ProfileAvatar } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { PredictionUser } from 'state/types'
import { useGetProfileAvatar } from 'state/profile/hooks'
import truncateWalletAddress from 'utils/truncateWalletAddress'

interface ResultAvatarProps extends FlexProps {
  user: PredictionUser
}

const AvatarWrapper = styled(Box)`
  order: 2;
  margin-left: 8px;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 1;
    margin-left: 0;
    margin-right: 8px;
  }
`

const UsernameWrapper = styled(Box)`
  order: 1;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 2;
  }
`

const ResultAvatar: React.FC<ResultAvatarProps> = ({ user, ...props }) => {
  const profileAvatar = useGetProfileAvatar(user.id)

  return (
    <Flex alignItems="center" {...props}>
      <UsernameWrapper>{profileAvatar.username || truncateWalletAddress(user.id)}</UsernameWrapper>
      <AvatarWrapper width={['32px', null, null, null, '40px']} height={['32px', null, null, null, '40px']}>
        <ProfileAvatar src={`/images/nfts/${profileAvatar.nft?.images?.md}`} height={40} width={40} />
      </AvatarWrapper>
    </Flex>
  )
}

export default ResultAvatar
