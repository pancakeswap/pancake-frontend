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

  let nftsToShow = nfts.filter((nft) => nft.marketData.isTradable)
  if (checksummedAddress === pancakeBunniesAddress) {
    nftsToShow = [...new Map(nftsToShow.map((nft) => [nft.attributes[0].value, nft])).values()]
  }

  const orderedNfts = orderBy(
    nftsToShow,
    (nft) => (sortBy === 'updatedAt' ? Number(nft.marketData[sortBy]) : nft.marketData[sortBy]),
    [sortBy === 'lowestTokenPrice' ? 'asc' : 'desc'],
  )

  return (
    <Grid
      gridGap="16px"
      gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
      alignItems="start"
    >
      {orderedNfts.map((nft) => {
        return <CollectibleLinkCard key={`${nft.tokenId}-${nft.collectionName}`} nft={nft} />
      })}
    </Grid>
  )
}

export default CollectionNfts
