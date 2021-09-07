import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAchievements, useFetchAchievements } from 'state/achievements/hooks'
import { Box } from '@pancakeswap/uikit'
import { useProfile } from 'state/profile/hooks'
import Page from 'components/Layout/Page'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './ProfileHeader'
import TabMenu from './TabMenu'

const NftProfile = () => {
  return (
    <>
      <MarketPageHeader>
        <ProfileHeader />

        <Box position="absolute" bottom="0">
          <TabMenu />
        </Box>
      </MarketPageHeader>

      <Page>Profile</Page>
    </>
  )
}

export default NftProfile
