import React from 'react'
import { useFetchCollections } from 'state/nftMarket/hooks'
import Activity from 'views/Nft/market/Activity'

const ActivityPage = () => {
  useFetchCollections()
  return <Activity />
}

export default ActivityPage
