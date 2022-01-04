import React from 'react'
import Collection from 'views/Nft/market/Collection'
import { NftMarketLayout } from 'views/Nft/market/Layout'

const CollectionPage = () => {
  return <Collection />
}

CollectionPage.getLayout = NftMarketLayout

export default CollectionPage
