import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Grid } from '@pancakeswap/uikit'
import pancakeBunnies from 'config/constants/nfts/pancakeBunnies'
import { useFetchCollections } from 'state/nftMarket/hooks'
import { CollectibleCard, Collectible } from './components/CollectibleCard'

const example1: Collectible = {
  name: 'Pancake Bunnies',
  cost: 1.5,
  nft: pancakeBunnies[1],
  status: 'profile',
}

const example2: Collectible = {
  name: 'Pancake Bunnies',
  cost: 12.55,
  lowestCost: 6.28,
  nft: pancakeBunnies[4],
  status: 'selling',
}

const example3: Collectible = {
  name: 'Pancake Bunnies',
  cost: 0.01,
  lowestCost: 0.0019,
  nft: pancakeBunnies[3],
  status: 'wallet',
}

const Market = () => {
  useFetchCollections()

  return (
    <Box>
      <Link to="/nft/market/collectibles">Collectibles</Link>
      <br />
      <Link to="/nft/market/profile">Profile</Link>
      <Grid
        p="16px"
        gridTemplateColumns={['1fr', null, null, 'repeat(3, 256px)']}
        gridGap="16px"
        justifyContent={['center', null, null, 'start']}
      >
        <div>
          <CollectibleCard collectible={example1} />
        </div>
        <div>
          <CollectibleCard collectible={example2} />
        </div>
        <div>
          <CollectibleCard collectible={example3} />
        </div>
      </Grid>
    </Box>
  )
}

export default Market
