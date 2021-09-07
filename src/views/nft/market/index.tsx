import React from 'react'
import { Grid } from '@pancakeswap/uikit'
import { useFetchCollections } from 'state/nftMarket/hooks'
import NftCard from '../components/CollectibleCard'
import { example1, example2, example3 } from './tmp'

const Market = () => {
  useFetchCollections()

  return (
    <Grid
      p="16px"
      gridTemplateColumns={['1fr', null, null, 'repeat(3, 256px)']}
      gridGap="16px"
      justifyContent={['center', null, null, 'start']}
    >
      <div>
        <NftCard collectible={example1} />
      </div>
      <div>
        <NftCard collectible={example2} />
      </div>
      <div>
        <NftCard collectible={example3} />
      </div>
    </Grid>
  )
}

export default Market
