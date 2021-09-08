import React from 'react'
import Page from 'components/Layout/Page'
import MarketPageHeader from '../components/MarketPageHeader'
import ProfileHeader from './ProfileHeader'

const NftProfile = () => {
  return (
    <>
      <MarketPageHeader>
        <ProfileHeader />
      </MarketPageHeader>
      <Page>Profile</Page>
    </>
  )
}

export default NftProfile
