import React from 'react'
import { Link } from 'react-router-dom'
import Page from 'components/Layout/Page'
import { nftsBaseUrl } from 'views/Nft/market'

const Collectible = () => {
  return (
    <>
      <Page>
        <Link to={`${nftsBaseUrl}/collections/pancake-bunnies`}>Pancake Bunnies</Link>
      </Page>
    </>
  )
}

export default Collectible
