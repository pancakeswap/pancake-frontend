import { NextLinkFromReactRouter as ReactRouterLink } from 'components/NextLink'
import { BscScanIcon, Flex, IconButton, Link, Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { getBlockExploreLink } from 'utils'
import { formatNumber } from 'utils/formatBalance'
import truncateHash from 'utils/truncateHash'
import { Achievement, Profile } from 'state/types'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useMemo } from 'react'
import EditProfileAvatar from './EditProfileAvatar'
import BannerHeader from '../../Nft/market/components/BannerHeader'
import StatBox, { StatBoxItem } from '../../Nft/market/components/StatBox'
import MarketPageTitle from '../../Nft/market/components/MarketPageTitle'
import EditProfileModal from './EditProfileModal'
import AvatarImage from '../../Nft/market/components/BannerHeader/AvatarImage'

interface HeaderProps {
  accountPath: string
  profile: Profile
  achievements: Achievement[]
  nftCollected: number
  isAchievementsLoading: boolean
  isNftLoading: boolean
  isProfileLoading: boolean
  onSuccess?: () => void
}

// Account and profile passed down as the profile could be used to render _other_ users' profiles.
const ProfileHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  accountPath,
  profile,
  achievements,
  nftCollected,
  isAchievementsLoading,
  isNftLoading,
  isProfileLoading,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [onEditProfileModal] = useModal(
    <EditProfileModal
      onSuccess={() => {
        if (onSuccess) {
          onSuccess()
        }
      }}
    />,
    false,
  )

  const isConnectedAccount = account?.toLowerCase() === accountPath?.toLowerCase()
  const numNftCollected = !isNftLoading ? (nftCollected ? formatNumber(nftCollected, 0, 0) : '-') : null
  const numPoints = !isProfileLoading ? (profile?.points ? formatNumber(profile.points, 0, 0) : '-') : null
  const numAchievements = !isAchievementsLoading
    ? achievements?.length
      ? formatNumber(achievements.length, 0, 0)
      : '-'
    : null

  const avatarImage = profile?.nft?.image?.thumbnail || '/images/nfts/no-profile-md.png'
  const profileTeamId = profile?.teamId
  const profileUsername = profile?.username
  const hasProfile = !!profile

  const bannerImage = useMemo(() => {
    const imagePath = '/images/teams'
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
            >
              <BscScanIcon width="20px" color="primary" />
            </IconButton>
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
                if (onSuccess) {
                  onSuccess()
                }
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
      return truncateHash(accountPath, 5, 3)
    }

    return null
  }, [profileUsername, accountPath])

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
        {accountPath && profile?.username && (
          <Link href={getBlockExploreLink(accountPath, 'address')} external bold color="primary">
            {truncateHash(accountPath)}
          </Link>
        )}
        {accountPath && isConnectedAccount && (!profile || !profile?.nft) && getActivateButton()}
      </Flex>
    )
  }, [accountPath, isConnectedAccount, onEditProfileModal, profile, t])

  return (
    <>
      <BannerHeader bannerImage={bannerImage} bannerAlt={t('User team banner')} avatar={avatar} />
      <MarketPageTitle pb="48px" title={title} description={description}>
        <StatBox>
          <StatBoxItem title={t('NFT Collected')} stat={numNftCollected} />
          <StatBoxItem title={t('Points')} stat={numPoints} />
          <StatBoxItem title={t('Achievements')} stat={numAchievements} />
        </StatBox>
      </MarketPageTitle>
    </>
  )
}

export default ProfileHeader
