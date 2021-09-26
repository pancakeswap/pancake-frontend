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

  let nftsToShow = orderBy(
    nfts.filter((nft) => nft.marketData.isTradable),
    (nft) => Number(nft.marketData[sortBy]),
    [sortBy === 'currentAskPrice' ? 'asc' : 'desc'],
  )
  if (checksummedAddress === pancakeBunniesAddress) {
    // PancakeBunnies should display 1 card per bunny id
    nftsToShow = nftsToShow.reduce((nftArray, current) => {
      const bunnyId = current.attributes[0].value
      if (!nftArray.find((nft) => nft.attributes[0].value === bunnyId)) {
        nftArray.push(current)
      }
      return nftArray
    }, [])
  }

  return (
    <Grid
      gridGap="16px"
      gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
      alignItems="start"
    >
      {nftsToShow.map((nft) => {
        return <CollectibleLinkCard key={`${nft.tokenId}-${nft.collectionName}`} nft={nft} />
      })}
    </Grid>
  )
}

export default CollectionNfts
