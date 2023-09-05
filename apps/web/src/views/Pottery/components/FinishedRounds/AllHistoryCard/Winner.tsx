import { styled } from 'styled-components'
import { Box, Flex, Text, ProfileAvatar, Skeleton } from '@pancakeswap/uikit'
import { useProfileForAddress } from 'state/profile/hooks'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useDomainNameForAddress } from 'hooks/useDomain'

const Container = styled(Flex)`
  min-width: 158px;
  max-width: 158px;
  padding: 4px 4px 4px 10px;
  border-top: solid 2px ${({ theme }) => theme.colors.cardBorder};
  margin: auto;
  &:first-child {
    border: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    &:first-child,
    &:nth-child(2) {
      border: 0;
    }
  }
`

interface WinnerProps {
  address: string
}

const Winner: React.FC<React.PropsWithChildren<WinnerProps>> = ({ address }) => {
  const { profile, isFetching } = useProfileForAddress(address)
  const { domainName, avatar } = useDomainNameForAddress(address)

  return (
    <Container>
      {!isFetching ? (
        <>
          <ProfileAvatar
            style={{ alignSelf: 'center' }}
            width={24}
            height={24}
            src={profile?.nft?.image?.thumbnail ?? avatar}
          />
          <Box ml="4px">
            <Text fontSize="12px" color="primary">
              {domainName || truncateHash(address)}
            </Text>
            <Text minHeight="18px" fontSize="12px" color="primary">
              {profile?.username ? `@${profile.username}` : null}
            </Text>
          </Box>
        </>
      ) : (
        <>
          <Skeleton variant="circle" width="24px" height="24px" mt="8px" />
          <Box ml="4px">
            <Skeleton width="80px" height="20px" mb="4px" />
            <Skeleton width="80px" height="20px" />
          </Box>
        </>
      )}
    </Container>
  )
}

export default Winner
