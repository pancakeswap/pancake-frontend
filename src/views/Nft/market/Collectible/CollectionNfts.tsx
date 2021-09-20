import React, { useEffect } from 'react'
import { Grid } from '@pancakeswap/uikit'
import { getAddress } from '@ethersproject/address'
import orderBy from 'lodash/orderBy'
import { useAppDispatch } from 'state'
import { useNftsFromCollection } from 'state/nftMarket/hooks'
import { getLastUpdatedFromNft, getLowestPriceFromNft } from 'state/nftMarket/helpers'
import { Collection } from 'state/nftMarket/types'
import { fetchNftsFromCollections } from 'state/nftMarket/reducer'
import GridPlaceholder from '../components/GridPlaceholder'
import { CollectibleCard } from '../components/CollectibleCard'
import Filters from './Filters'

interface CollectionNftsProps {
  collection: Collection
  sortBy?: string
}

const CollectionNfts: React.FC<CollectionNftsProps> = ({ collection, sortBy = 'updatedAt' }) => {
  const { address } = collection
  const checksummedAddress = getAddress(address)
  const nfts = useNftsFromCollection(checksummedAddress)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchNftsFromCollections(checksummedAddress))
  }, [checksummedAddress, dispatch])

  if (!nfts) {
    return <GridPlaceholder />
  }

  const nftList = Object.values(nfts).map((nft) => ({
    ...nft,
    meta: {
      lowestTokenPrice: getLowestPriceFromNft(nft),
      updatedAt: getLastUpdatedFromNft(nft),
    },
  }))
  const orderedNfts = orderBy(nftList, [`meta.${sortBy}`], [sortBy === 'lowestTokenPrice' ? 'asc' : 'desc'])

  return (
    <>
      <Filters collection={collection} />
      <Grid
        gridGap="16px"
        gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
        alignItems="start"
      >
        {orderedNfts.map((nft) => {
          return <CollectibleCard key={nft.id} nft={nft} />
        })}
      </Grid>
    </>
  )
}

export default CollectionNfts
