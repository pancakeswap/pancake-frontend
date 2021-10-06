import React from 'react'
import { Grid } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import { Collection } from 'state/nftMarket/types'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import useAllPancakeBunnyNfts from '../../hooks/useAllPancakeBunnyNfts'

interface CollectionNftsProps {
  collection: Collection
  sortBy?: string
}

const PancakeBunniesCollectionNfts: React.FC<CollectionNftsProps> = ({ collection, sortBy = 'updatedAt' }) => {
  const { address } = collection
  const allPancakeBunnyNfts = useAllPancakeBunnyNfts(address)
  const sortedNfts = orderBy(allPancakeBunnyNfts, (nft) => (nft.meta[sortBy] ? Number(nft.marketData[sortBy]) : 0), [
    sortBy === 'currentAskPrice' ? 'asc' : 'desc',
  ])

  return (
    <>
      <Grid
        gridGap="16px"
        gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
        alignItems="start"
      >
        {sortedNfts.map((nft) => {
          return <CollectibleLinkCard key={`${nft.tokenId}-${nft.collectionName}`} nft={nft} />
        })}
      </Grid>
    </>
  )
}

export default PancakeBunniesCollectionNfts
