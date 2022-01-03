import NftProfile from 'views/Nft/market/Profile'
import React from 'react'
import { NftMarketLayout } from 'views/Nft/market/Layout'

const NftProfilePage = () => {
  return <NftProfile />
}

NftProfilePage.getLayout = NftMarketLayout

export default NftProfilePage
