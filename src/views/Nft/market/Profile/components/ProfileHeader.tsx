import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BscScanIcon, Flex, Heading, Link, IconButton, Skeleton, Text, Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'
import { Profile } from 'state/types'
import { getBscScanLink } from 'utils'
import BannerHeader from '../../components/BannerHeader'
import EditProfileModal from './EditProfileModal'
import EditProfileAvatar from './EditProfileAvatar'
import AvatarImage from '../../components/BannerHeader/AvatarImage'

const StyledIconButton = styled(IconButton)`
  width: fit-content;
`

const IconButtons: React.FC<{ account: string }> = ({ account }) => {
  const { t } = useTranslation()
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

const TextContent: React.FC<{ account: string; profile: Profile }> = ({ account, profile }) => {
  const { t } = useTranslation()
  const [onEditProfileModal] = useModal(<EditProfileModal />, false)

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
  const { t } = useTranslation()

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

const Avatar: React.FC<{ avatarImage: string; profile: Profile }> = ({ avatarImage, profile }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

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

interface HeaderProps {
  bannerImage: string
  avatarImage: string
  account: string
  numAchievements: number
  profile: Profile
}

const ProfileHeader: React.FC<HeaderProps> = ({ avatarImage, bannerImage, account, numAchievements, profile }) => {
  const { t } = useTranslation()
  const { points } = profile || {}

  return (
    <BannerHeader
      bannerImage={bannerImage}
      bannerAlt={t('User team banner')}
      Avatar={Avatar({ avatarImage, profile })}
      IconButtons={IconButtons({ account })}
      TextContent={TextContent({ account, profile })}
      CollectionStats={CollectionStats({ points, numAchievements })}
    />
  )
}

export default ProfileHeader
