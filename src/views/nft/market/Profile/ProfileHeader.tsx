import React from 'react'
import styled from 'styled-components'
import { ArrowBackIcon, Flex, Heading, IconButton, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'
import { useProfile } from 'state/profile/hooks'
import { getBscScanLink } from 'utils'
import BannerHeader from '../components/BannerHeader'
import EditProfileAvatar from './EditProfileAvatar'
import AvatarImage from '../components/BannerHeader/AvatarImage'

const StyledIconButton = styled(IconButton)`
  width: fit-content;
`

const IconButtons: React.FC<{ account: string }> = ({ account }) => {
  return (
    // TODO: Implement real logo
    // TODO: Share functionality once user profiles routed by ID
    <Flex display="inline-flex">
      {account && (
        <StyledIconButton as="a" href={getBscScanLink(account, 'address')}>
          <ArrowBackIcon width="20px" color="primary" />
        </StyledIconButton>
      )}
    </Flex>
  )
}

const TextContent: React.FC<{ account: string; username: string }> = ({ account, username }) => {
  return (
    <Flex flexDirection="column" mb={[16, null, 0]} mr={[0, null, 16]}>
      {username && (
        <Heading mb={12} scale="lg" color="secondary">
          @{username}
        </Heading>
      )}
      {account ? (
        <Text bold color="primary">
          {truncateHash(account)}
        </Text>
      ) : (
        <Skeleton width={80} height={16} my={4} />
      )}
    </Flex>
  )
}

const CollectionStats: React.FC<{ numPoints: number; numAchievements: number }> = ({ numPoints, numAchievements }) => {
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
        <Text bold>{numPoints || '-'}</Text>
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
  const { t } = useTranslation()
  const { profile } = useProfile()

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

interface HeaderProps {
  bannerImage: string
  avatarImage: string
  account: string
  username: string
  numPoints: number
  numAchievements: number
}

const ProfileHeader: React.FC<HeaderProps> = ({
  avatarImage,
  bannerImage,
  account,
  username,
  numPoints,
  numAchievements,
}) => {
  const { t } = useTranslation()

  return (
    <BannerHeader
      bannerImage={bannerImage}
      bannerAlt={t('User team banner')}
      Avatar={Avatar({ avatarImage })}
      IconButtons={IconButtons({ account })}
      TextContent={TextContent({ account, username })}
      CollectionStats={CollectionStats({ numPoints, numAchievements })}
    />
  )
}

export default ProfileHeader
