import React from 'react'
import { NftMarketLayout } from 'views/Nft/market/Layout'
import NftMarket from 'views/Nft/market/Home'

const NftMarketPage = () => {
  return <NftMarket />
}

NftMarketPage.getLayout = NftMarketLayout
export default NftMarketPage
