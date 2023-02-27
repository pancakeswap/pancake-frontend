import {
  NoProfileAvatarIcon,
  Flex,
  Heading,
  Skeleton,
  Text,
  Box,
  useMatchBreakpoints,
  VisibilityOff,
  VisibilityOn,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import styled from 'styled-components'
import { useProfile } from 'state/profile/hooks'
import ProfileAvatarWithTeam from 'components/ProfileAvatarWithTeam'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import useGetUsernameWithVisibility from 'hooks/useUsernameWithVisibility'

const Desktop = styled(Flex)`
  align-items: center;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`

const Mobile = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const Sticker = styled(Flex)`
  height: 92px;
  width: 92px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  border: 3px solid ${({ theme }) => theme.colors.invertedContrast};
  border-radius: ${({ theme }) => theme.radii.circle};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const StyledNoProfileAvatarIcon = styled(NoProfileAvatarIcon)`
  height: 100%;
  width: 100%;
`

const UserDetail = () => {
  const { profile, isLoading } = useProfile()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isMobile, isTablet, isDesktop } = useMatchBreakpoints()
  const { usernameWithVisibility, userUsernameVisibility, setUserUsernameVisibility } =
    useGetUsernameWithVisibility(profile)

  const toggleUsernameVisibility = () => {
    setUserUsernameVisibility(!userUsernameVisibility)
  }

  const Icon = userUsernameVisibility ? VisibilityOff : VisibilityOn

  return (
    <>
      {(isTablet || isDesktop) && (
        <Desktop>
          <Box mr="24px">
            <Sticker>{profile ? <ProfileAvatarWithTeam profile={profile} /> : <StyledNoProfileAvatarIcon />}</Sticker>
          </Box>
          <Flex flexDirection="column">
            {profile ? (
              <Heading scale="xl">
                {t('Hi, %userName%!', {
                  userName: usernameWithVisibility,
                })}
                <Icon ml="4px" onClick={toggleUsernameVisibility} cursor="pointer" />
              </Heading>
            ) : isLoading ? (
              <Skeleton width={200} height={40} my="4px" />
            ) : null}
            {isLoading || !account ? (
              <Skeleton width={160} height={16} my="4px" />
            ) : (
              <Text fontSize="16px"> {t('Connected with %address%', { address: truncateHash(account) })}</Text>
            )}
          </Flex>
        </Desktop>
      )}
      {isMobile && (
        <Mobile>
          {profile ? (
            <Heading mb="18px" textAlign="center">
              {t('Hi, %userName%!', {
                userName: usernameWithVisibility,
              })}
              <Icon ml="4px" onClick={toggleUsernameVisibility} cursor="pointer" />
            </Heading>
          ) : isLoading ? (
            <Skeleton width={120} height={20} mt="2px" mb="18px" />
          ) : null}
        </Mobile>
      )}
    </>
  )
}

export default UserDetail
