import React from 'react'
import { NftMarketLayout } from 'views/Nft/market/Layout'
import NftProfile from 'views/Nft/market/Profile'
import ActivityHistory from 'views/Nft/market/Profile/components/ActivityHistory'
import SubMenu from 'views/Nft/market/Profile/components/SubMenu'

const NftProfileActivityPage = () => {
  return (
    <>
      <SubMenu />
      <ActivityHistory />
    </>
  )
}

NftProfileActivityPage.Layout = ({ children }) => {
  return (
    <NftProfile>
      <NftMarketLayout>{children}</NftMarketLayout>
    </NftProfile>
  )
}

export default NftProfileActivityPage
