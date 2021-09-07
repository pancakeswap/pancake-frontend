import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BscScanIcon, Flex, Heading, Link, IconButton, Skeleton, Text, Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Profile } from 'state/types'
import { useProfile } from 'state/profile/hooks'
import { useFetchAchievements } from 'state/achievements/hooks'
import { getBscScanLink } from 'utils'
import { formatNumber } from 'utils/formatBalance'
import truncateHash from 'utils/truncateHash'
import EditProfileAvatar from './EditProfileAvatar'
import BannerHeader from '../../components/BannerHeader'
import StatBox, { StatBoxItem } from '../../components/StatBox'
import MarketPageTitle from '../../components/MarketPageTitle'
import EditProfileModal from './EditProfileModal'
import AvatarImage from '../../components/BannerHeader/AvatarImage'

interface AvatarProps {
  avatarImage: string
  profile?: Profile
}

const StyledIconButton = styled(IconButton)`
  width: fit-content;
`

const ProfileHeader: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { profile, isInitialized } = useProfile()
  const [onEditProfileModal] = useModal(<EditProfileModal />, false)

  useFetchAchievements()

  const IconButtons = () => {
    return (
      // TODO: Share functionality once user profiles routed by ID
      <Flex display="inline-flex">
        {account && (
          <StyledIconButton
            target="_blank"
            as="a"
            href={getBscScanLink(account, 'address')}
            alt={t('View BscScan for user address')}
          >
            <BscScanIcon width="20px" color="primary" />
          </StyledIconButton>
        )}
      </Flex>
    )
  }

  const TextContent = () => {
    const getActivateButton = () => {
      if (!profile) {
        return (
          <Link href="/nft/market/profile/create">
            <Button mt="16px">{t('Activate Profile')}</Button>
          </Link>
        )
      }
      return (
        <Button mt="16px" onClick={onEditProfileModal}>
          {t('Rectivate Profile')}
        </Button>
      )
    }

    return (
      <Flex flexDirection="column" mb={[16, null, 0]} mr={[0, null, 16]}>
        {profile?.username && (
          <Heading mb={12} scale="lg" color="secondary">
            @{profile.username}
          </Heading>
        )}
        {account ? (
          <Link href={getBscScanLink(account, 'address')} external bold color="primary">
            {truncateHash(account)}
          </Link>
        ) : (
          <Skeleton width={80} height={16} my={4} />
        )}
        {account && (!profile || !profile?.nft) && getActivateButton()}
      </Flex>
    )
  }

  const CollectionStats: React.FC<{ points: number; numAchievements: number }> = ({ points, numAchievements }) => {
    return (
      <>
        <Flex flexDirection="column" alignItems="center">
          <Text fontSize="12px" mb="8px" color="textSubtle">
            {t('NFT Collected')}
          </Text>
          {/* TODO: Use real data */}
          <Text bold>42</Text>
        </Flex>
        <Flex flexDirection="column" alignItems="center">
          <Text fontSize="12px" mb="8px" color="textSubtle">
            {t('Points')}
          </Text>
          <Text bold>{points || '-'}</Text>
        </Flex>
        <Flex flexDirection="column" alignItems="center">
          <Text fontSize="12px" mb="8px" color="textSubtle">
            {t('Achievements')}
          </Text>
          <Text bold>{numAchievements || '-'}</Text>
        </Flex>
      </>
    )
  }

  const Avatar: React.FC<{ avatarImage: string }> = ({ avatarImage }) => {
    return (
      <>
        {profile && account ? (
          <EditProfileAvatar src={avatarImage} alt={t('User profile picture')} />
        ) : (
          <AvatarImage src={avatarImage} alt={t('User profile picture')} />
        )}
      </>
    )
  }

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
