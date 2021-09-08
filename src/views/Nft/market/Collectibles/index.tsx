import React from 'react'
import { Link } from 'react-router-dom'
import Page from 'components/Layout/Page'

const Collectible = () => {
  return (
    <>
      <Page>
        <Link to="/nft/market/collectibles/pancake-squad">Pancake Bunnies</Link>
      </Page>
    </>
  )
}

export default Collectible
