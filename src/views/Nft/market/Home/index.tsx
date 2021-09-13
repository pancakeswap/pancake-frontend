import React from 'react'
import { Link } from 'react-router-dom'
import Page from 'components/Layout/Page'

const Home = () => {
  return (
    <>
      <Page>
        <Link to="/nft/market/collectibles">Collectibles</Link>
        <br />
        <Link to="/nft/market/profile">Profile</Link>
        <br />
        <Link to="/nft/market/item/7">Individual NFT page</Link>
      </Page>
    </>
  )
}

export default Home
