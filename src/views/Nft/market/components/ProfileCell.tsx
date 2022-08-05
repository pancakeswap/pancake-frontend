import styled from 'styled-components'
import { Box, Flex, Skeleton, Text, ProfileAvatar } from '@pancakeswap/uikit'
import truncateHash from 'utils/truncateHash'
import { useProfileForAddress } from 'state/profile/hooks'
import { NextLinkFromReactRouter } from 'components/NextLink'

const StyledFlex = styled(Flex)`
  align-items: center;
  transition: opacity 200ms ease-in;

  &:hover {
    opacity: 0.5;
  }
`

const ProfileCell: React.FC<{ accountAddress: string }> = ({ accountAddress }) => {
  const { profile, isFetching } = useProfileForAddress(accountAddress)
  const profileName = profile?.username || '-'

  return (
    <NextLinkFromReactRouter to={`/profile/${accountAddress}`}>
      <StyledFlex>
        {!isFetching ? (
          <ProfileAvatar
            width={32}
            height={32}
            mr={['4px', null, '12px']}
            src={profile?.nft?.image?.thumbnail}
            style={{ minWidth: '32px', minHeight: '32px' }}
          />
        ) : (
          <Skeleton variant="circle" width="32px" height="32px" mr={['4px', null, '12px']} />
        )}
        <Box display="inline">
          <Text lineHeight="1.25">{truncateHash(accountAddress)}</Text>
          {isFetching ? <Skeleton /> : <Text lineHeight="1.25">{profileName}</Text>}
        </Box>
      </StyledFlex>
    </NextLinkFromReactRouter>
  )
}

export default ProfileCell
