import React, { useEffect } from 'react'
import { Grid } from '@pancakeswap/uikit'
import { getAddress } from '@ethersproject/address'
import orderBy from 'lodash/orderBy'
import { useAppDispatch } from 'state'
import { useNftsFromCollection } from 'state/nftMarket/hooks'
import { Collection } from 'state/nftMarket/types'
import { fetchNftsFromCollections } from 'state/nftMarket/reducer'
import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard } from '../../components/CollectibleCard'
import { pancakeBunniesAddress } from '../../constants'
import useAllPancakeBunnyNfts from '../../hooks/useAllPancakeBunnyNfts'

interface CollectionNftsProps {
  collection: Collection
  sortBy?: string
}

const CollectionNfts: React.FC<CollectionNftsProps> = ({ collection, sortBy = 'updatedAt' }) => {
  const { address } = collection
  const checksummedAddress = getAddress(address)
  const nfts = useNftsFromCollection(checksummedAddress)
  const dispatch = useAppDispatch()

  const isPBCollection = address === pancakeBunniesAddress

  useEffect(() => {
    dispatch(fetchNftsFromCollections(checksummedAddress))
  }, [checksummedAddress, dispatch])

  const allPancakeBunnyNfts = useAllPancakeBunnyNfts(address)

  let nftsToShow = isPBCollection ? allPancakeBunnyNfts : nfts.filter((nft) => nft.marketData.isTradable)

  if (!nftsToShow) {
    return <GridPlaceholder />
  }

  nftsToShow = orderBy(nftsToShow, (nft) => (isPBCollection ? nft.meta[sortBy] : Number(nft.marketData[sortBy])), [
    sortBy === 'currentAskPrice' ? 'asc' : 'desc',
  ])

  return (
    <Grid
      gridGap="16px"
      gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
      alignItems="start"
    >
      {nftsToShow.map((nft) => {
        return <CollectibleLinkCard key={`${nft.tokenId}-${nft.collectionName}`} nft={nft} />
      })}
    </Grid>
  )
}

export default CollectionNfts
