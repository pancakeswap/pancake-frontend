import React from 'react'
import { Box } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useAchievements, useFetchAchievements } from 'state/achievements/hooks'
import { useProfile } from 'state/profile/hooks'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import ProfileHeader from './ProfileHeader'
import TabMenu from './TabMenu'

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
          return `${imagePath}/cakers-banner.png`
        case 3:
          return `${imagePath}/flippers-banner.png`
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
      <PageHeader position="relative" background="linear-gradient(111.68deg, #f2ecf2 0%, #e8f2f6 100%)" pb={80}>
        <ProfileHeader
          avatarImage={avatarImage}
          bannerImage={getBannerImage()}
          account={account}
          username={profile?.username}
          numPoints={profile?.points}
          numAchievements={achievements?.length}
        />
        <Box position="absolute" bottom="0">
          <TabMenu />
        </Box>
      </PageHeader>
      <Page>sss</Page>
    </>
  )
}

export default NftProfile
