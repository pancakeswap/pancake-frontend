import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAchievements, useFetchAchievements } from 'state/achievements/hooks'
import { useProfile } from 'state/profile/hooks'
import Page from 'components/Layout/Page'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './ProfileHeader'

const NftProfile = () => {
  const { profile } = useProfile()
  const achievements = useAchievements()
  const { account } = useWeb3React()

  useFetchAchievements()

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

  return (
    <>
      <MarketPageHeader>
        <ProfileHeader
          avatarImage={avatarImage}
          bannerImage={getBannerImage()}
          account={account}
          username={profile?.username}
          numPoints={profile?.points}
          numAchievements={achievements?.length}
        />
      </MarketPageHeader>
      <Page>Profile</Page>
    </>
  )
}

export default NftProfile
