import { Box, Flex, ProfileAvatar, Skeleton, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'

import truncateHash from '@pancakeswap/utils/truncateHash'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { useProfileForAddress } from 'hooks/useProfile'

const StyledFlex = styled(Flex)`
  align-items: center;
  transition: opacity 200ms ease-in;

  &:hover {
    opacity: 0.5;
  }
`

export const ProfileCell: React.FC<React.PropsWithChildren<{ accountAddress: string }>> = ({ accountAddress }) => {
  const { profile, isFetching } = useProfileForAddress(accountAddress)
  const { domainName } = useDomainNameForAddress(accountAddress)
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
          <Text lineHeight="1.25">{domainName || truncateHash(accountAddress)}</Text>
          {isFetching ? <Skeleton /> : <Text lineHeight="1.25">{profileName}</Text>}
        </Box>
      </StyledFlex>
    </NextLinkFromReactRouter>
  )
}
