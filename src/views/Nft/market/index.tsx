import React from 'react'
import { Link } from 'react-router-dom'
import { useFetchCollections } from 'state/nftMarket/hooks'
import Page from 'components/Layout/Page'
import { PriceFilter } from './components/Filters'

const Market = () => {
  const handleApply = (min: number, max: number) => {
    console.log(min, max)
  }

  useFetchCollections()

  return (
    <Page>
      <Link to="/nft/market/collectibles">Collectibles</Link>
      <br />
      <Link to="/nft/market/profile">Profile</Link>
      <br />
      <Link to="/nft/market/item/7">Individual NFT page</Link>
      <br />
      <br />
      <PriceFilter min={1} max={100} onApply={handleApply} />
    </Page>
  )
}

export default Market
