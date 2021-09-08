import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Profile } from 'state/types'
import { useProfile } from 'state/profile/hooks'
import { useFetchAchievements } from 'state/achievements/hooks'
import { getBscScanLink } from 'utils'
import { formatNumber } from 'utils/formatBalance'
import truncateHash from 'utils/truncateHash'
import BannerHeader from '../components/BannerHeader'
import EditProfileAvatar from './EditProfileAvatar'
import AvatarImage from '../components/BannerHeader/AvatarImage'
import StatBox, { StatBoxItem } from '../components/StatBox'
import MarketPageTitle from '../components/MarketPageTitle'

interface AvatarProps {
  avatarImage: string
  profile?: Profile
}

const Avatar: React.FC<AvatarProps> = ({ avatarImage, profile }) => {
  const { t } = useTranslation()

  return (
    <>
      {profile ? (
        <EditProfileAvatar src={avatarImage} alt={t('User profile picture')} />
      ) : (
        // TODO: Trigger creating profile modal onClick - or have EditProfileAvatar handle this
        <AvatarImage src={avatarImage} alt={t('User profile picture')} />
      )}
    </>
  )
}

const ProfileHeader: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { profile, isInitialized } = useProfile()

  useFetchAchievements()

  const getTitle = () => {
    if (isInitialized && !profile) {
      return truncateHash(account, 5, 3)
    }

    return `@${profile.username}`
  }

  const renderDescription = () => {
    if (isInitialized && !profile) {
      return null
    }

    return (
      <Link href={getBscScanLink(account, 'address')} external>
        {truncateHash(account, 5, 3)}
      </Link>
    )
  }

  const getBannerImage = () => {
    const imagePath = '/images/teams'
    if (profile) {
      switch (profile.teamId) {
        case 1:
          return `${imagePath}/storm-banner.png`
        case 2:
          return `${imagePath}/flippers-banner.png`
        case 3:
          return `${imagePath}/cakers-banner.png`
        default:
          return null
      }
    }
    return null
  }

  const avatarImage = profile?.nft?.images?.md
    ? `/images/nfts/${profile?.nft?.images?.md}`
    : '/images/nfts/no-profile-md.png'

  // Tmp
  const nftCollected = 43
  const points = 345
  const achievements = 2

  return (
    <>
      <BannerHeader bannerImage={getBannerImage()} bannerAlt={t('User team banner')} avatar={Avatar({ avatarImage })} />
      <MarketPageTitle title={getTitle()} description={renderDescription()}>
        <StatBox>
          <StatBoxItem title={t('NFT Collected')} stat={formatNumber(nftCollected, 0, 0)} />
          <StatBoxItem title={t('Points')} stat={formatNumber(points, 0, 0)} />
          <StatBoxItem title={t('Achievements')} stat={formatNumber(achievements, 0, 0)} />
        </StatBox>
      </MarketPageTitle>
    </>
  )
}

export default ProfileHeader
