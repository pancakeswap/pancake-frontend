import React from 'react'
import { useFetchCollections } from 'state/nftMarket/hooks'

const Market = () => {
  useFetchCollections()
  return <div>Market</div>
}

export default Market
