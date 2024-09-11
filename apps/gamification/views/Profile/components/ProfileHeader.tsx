import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  CogIcon,
  Flex,
  Grid,
  Heading,
  IconButton,
  ScanLink,
  useModal,
  useToast,
  VisibilityOff,
  VisibilityOn,
} from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { NextLinkFromReactRouter as ReactRouterLink } from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { Achievement } from 'config/constants/types'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { Profile } from 'hooks/useProfile/type'
import { useSiwe } from 'hooks/useSiwe'
import useGetUsernameWithVisibility from 'hooks/useUsernameWithVisibility'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getBlockExploreLink, safeGetAddress } from 'utils'
import { encodePacked, keccak256 } from 'viem'
import { SocialHubType, useUserSocialHub } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import {
  connectSocial,
  VerificationDataBaseConfig,
  VerificationDiscordConfig,
  VerificationTwitterConfig,
} from 'views/Profile/utils/connectSocial'
import { useAccount, useSignMessage } from 'wagmi'
import AvatarImage from './AvatarImage'
import { BannerHeader } from './BannerHeader'
import EditProfileAvatar from './EditProfileAvatar'
import EditProfileModal from './EditProfileModal'
import { SettingsModal } from './SettingsModal'
import StatBox, { StatBoxItem } from './StatBox'

interface HeaderProps {
  accountPath: string
  profile: Profile | null
  achievements: Achievement[] | null
  nftCollected: number | null
  isAchievementsLoading: boolean
  isNftLoading: boolean
  isProfileLoading: boolean
  onSuccess?: () => void
}

// Account and profile passed down as the profile could be used to render _other_ users' profiles.
const ProfileHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  accountPath,
  profile,
  nftCollected,
  isNftLoading,
  isProfileLoading,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { address: account, connector } = useAccount()
  const { userInfo, refresh, isFetched } = useUserSocialHub()
  const { data: session } = useSession()
  const { toastSuccess, toastError } = useToast()
  const [isFetchingApi, setIsFetchingApi] = useState(false)
  const { query } = useRouter()
  const { signMessageAsync } = useSignMessage()
  const isFetchingRef = useRef(false)
  const { fetchWithSiweAuth } = useSiwe()

  // Handle when Oauth callback fail
  useEffect(() => {
    if (query.error) {
      const newURL = `${window.location.origin}${window.location.pathname}`
      window.history.pushState({}, '', newURL)
      toastError(t('Connected Fail'))
    }
  }, [query, t, toastError])

  useEffect(() => {
    const fetchSocial = async ({
      social,
      id,
      token,
      tokenSecret,
    }: {
      social: SocialHubType
      id: string
      token: string
      tokenSecret?: string
    }) => {
      if (account && !isFetchingApi) {
        setIsFetchingApi(true)

        try {
          const walletAddress = account
          const timestamp = Math.floor(new Date().getTime() / 1000)
          const message = keccak256(encodePacked(['address', 'uint256'], [walletAddress ?? '0x', BigInt(timestamp)]))
          const signature = await signMessageAsync({ message })

          let verificationData: VerificationDataBaseConfig = { id }
          if (social === SocialHubType.Twitter) {
            verificationData = {
              id,
              oauth_token: token,
              oauth_token_secret: tokenSecret,
            } as VerificationTwitterConfig
          }

          if (social === SocialHubType.Discord) {
            verificationData = {
              id,
              access_token: token,
            } as VerificationDiscordConfig
          }
          if (signature) {
            await connectSocial({
              userInfo,
              data: {
                socialMedia: social,
                userId: walletAddress,
                signedData: { walletAddress, timestamp },
                verificationData,
                signature,
              },
              fetchWithSiweAuth,
              callback: () => {
                toastSuccess(t('%social% Connected', { social }))
                refresh?.()
              },
            })
            isFetchingRef.current = false
          }
        } catch (error) {
          const errorMessage = error instanceof Error && error?.message ? error.message : JSON.stringify(error)
          toastError(`Failed to connect ${social}: ${errorMessage}`)
          console.error(`Connect ${social} error: `, error)
        } finally {
          setTimeout(() => setIsFetchingApi(false), 1000)
        }
      }
    }

    if (
      connector &&
      typeof connector.getChainId === 'function' &&
      isFetched &&
      session &&
      new Date(session?.expires).getTime() > new Date().getTime() &&
      !isFetchingRef.current
    ) {
      isFetchingRef.current = true
      if (!userInfo?.socialHubToSocialUserIdMap?.Discord && (session as any).user?.discord) {
        const { discordId, token } = (session as any).user?.discord
        fetchSocial({ social: SocialHubType.Discord, id: discordId, token })
      }

      if (!userInfo?.socialHubToSocialUserIdMap?.Twitter && (session as any).user?.twitter) {
        const { twitterId, token, tokenSecret } = (session as any).user?.twitter
        fetchSocial({ social: SocialHubType.Twitter, id: twitterId, token, tokenSecret })
      }
    }
  }, [
    account,
    isFetched,
    isFetchingApi,
    session,
    t,
    refresh,
    toastError,
    toastSuccess,
    userInfo,
    signMessageAsync,
    connector,
    fetchWithSiweAuth,
  ])

  const { domainName, avatar: avatarFromDomain } = useDomainNameForAddress(accountPath)
  const { usernameWithVisibility, userUsernameVisibility, setUserUsernameVisibility } = useGetUsernameWithVisibility(
    profile?.username || '',
  )

  const [onEditProfileModal] = useModal(
    <EditProfileModal
      onSuccess={() => {
        onSuccess?.()
      }}
    />,
    false,
  )

  const [onPressSettingsModal] = useModal(
    <SettingsModal userInfo={userInfo} refresh={refresh} />,
    true,
    true,
    'socialHubModal',
  )

  useEffect(() => {
    if (query.openSettingModal && query.openSettingModal === 'true') {
      const newURL = `${window.location.origin}${window.location.pathname}`
      window.history.pushState({}, '', newURL)
      onPressSettingsModal()
    }
  }, [onPressSettingsModal, query?.openSettingModal])

  const isConnectedAccount = safeGetAddress(account) === safeGetAddress(accountPath)
  const numNftCollected = !isNftLoading ? (nftCollected ? formatNumber(nftCollected, 0, 0) : '-') : null
  const numPoints = !isProfileLoading ? (profile?.points ? formatNumber(profile.points, 0, 0) : '-') : null

  const avatarImage = profile?.nft?.image?.thumbnail ?? (avatarFromDomain || '/images/nfts/no-profile-md.png')
  const profileTeamId = profile?.teamId
  const profileUsername = isConnectedAccount ? usernameWithVisibility : profile?.username
  const hasProfile = !!profile

  const toggleUsernameVisibility = () => {
    setUserUsernameVisibility(!userUsernameVisibility)
  }

  const Icon = userUsernameVisibility ? VisibilityOff : VisibilityOn

  const bannerImage = useMemo(() => {
    const imagePath = `${ASSET_CDN}/web/teams`
    switch (profileTeamId) {
      case 1:
        return `${imagePath}/storm-banner.png`
      case 2:
        return `${imagePath}/flippers-banner.png`
      case 3:
        return `${imagePath}/cakers-banner.png`
      default:
        break
    }
    return `${imagePath}/no-team-banner.png`
  }, [profileTeamId])

  const avatar = useMemo(() => {
    const getIconButtons = () => {
      return (
        // TODO: Share functionality once user profiles routed by ID
        <Flex display="inline-flex">
          {accountPath && (
            <IconButton
              as="a"
              target="_blank"
              style={{
                width: 'fit-content',
              }}
              href={getBlockExploreLink(accountPath, 'address') || ''}
              // @ts-ignore
              alt={t('View BscScan for user address')}
            />
          )}
        </Flex>
      )
    }

    const getImage = () => {
      return (
        <>
          {hasProfile && accountPath && isConnectedAccount ? (
            <EditProfileAvatar
              src={avatarImage}
              alt={t('User profile picture')}
              onSuccess={() => {
                onSuccess?.()
              }}
            />
          ) : (
            <AvatarImage src={avatarImage} alt={t('User profile picture')} />
          )}
        </>
      )
    }
    return (
      <>
        {getImage()}
        {getIconButtons()}
      </>
    )
  }, [accountPath, avatarImage, isConnectedAccount, onSuccess, hasProfile, t])

  const title = useMemo(() => {
    if (profileUsername) {
      return `@${profileUsername}`
    }

    if (accountPath) {
      return domainName || truncateHash(accountPath, 5, 3)
    }

    return null
  }, [domainName, profileUsername, accountPath])

  const description = useMemo(() => {
    const getActivateButton = () => {
      if (!profile) {
        return (
          <ReactRouterLink to="/create-profile">
            <Button mt="16px">{t('Activate Profile')}</Button>
          </ReactRouterLink>
        )
      }
      return (
        <Button width="fit-content" mt="16px" onClick={onEditProfileModal}>
          {t('Reactivate Profile')}
        </Button>
      )
    }

    return (
      <Flex flexDirection="column" mb={[16, null, 0]} mr={[0, null, 16]}>
        <Flex>
          {accountPath && profile?.username && (
            <>
              <ScanLink href={getBlockExploreLink(accountPath, 'address')} bold color="primary">
                {domainName || truncateHash(accountPath)}
              </ScanLink>
              <Button
                variant="text"
                endIcon={<CogIcon color="primary" height={20} width={20} />}
                onClick={onPressSettingsModal}
              >
                {t('Settings')}
              </Button>
            </>
          )}
        </Flex>
        {accountPath && isConnectedAccount && (!profile || !profile?.nft) && getActivateButton()}
      </Flex>
    )
  }, [accountPath, profile, domainName, onPressSettingsModal, t, isConnectedAccount, onEditProfileModal])

  return (
    <>
      <BannerHeader bannerImage={bannerImage} bannerAlt={t('User team banner')} avatar={avatar} />
      <Grid
        pb="48px"
        gridGap="16px"
        alignItems="center"
        gridTemplateColumns={['1fr', null, null, null, 'repeat(2, 1fr)']}
      >
        <Box>
          <Heading as="h1" scale="xl" color="secondary" mb="16px">
            {title}
            {isConnectedAccount && profile?.username ? (
              <Icon ml="4px" onClick={toggleUsernameVisibility} cursor="pointer" />
            ) : null}
          </Heading>
          {description}
        </Box>
        <Box>
          <StatBox>
            <StatBoxItem title={t('NFT Collected')} stat={numNftCollected} />
            <StatBoxItem title={t('Points')} stat={numPoints} />
          </StatBox>
        </Box>
      </Grid>
    </>
  )
}

export default ProfileHeader
