import React from 'react'
import { Link } from 'react-router-dom'
import { Box } from '@pancakeswap/uikit'
import { useFetchCollections } from 'state/nftMarket/hooks'

const Market = () => {
  useFetchCollections()

  return (
    <Box p="32px">
      <Link to="/nft/market/collectibles">Collectibles</Link>
      <br />
      <Link to="/nft/market/profile">Profile</Link>
    </Box>
  )
}

export default Market
