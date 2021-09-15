import React, { useEffect } from 'react'
import { Grid } from '@pancakeswap/uikit'
import { getAddress } from '@ethersproject/address'
import orderBy from 'lodash/orderBy'
import { useAppDispatch } from 'state'
import { useNftsFromCollection } from 'state/nftMarket/hooks'
import { fetchNftsFromCollections } from 'state/nftMarket/reducer'
import GridPlaceholder from '../components/GridPlaceholder'
import { CollectibleCard } from '../components/CollectibleCard'

interface CollectionNftsProps {
  collectionName: string
  collectionAddress: string
}

const CollectionNfts: React.FC<CollectionNftsProps> = ({ collectionName, collectionAddress }) => {
  const checksummedAddress = getAddress(collectionAddress)
  const nfts = useNftsFromCollection(checksummedAddress)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchNftsFromCollections(checksummedAddress))
  }, [checksummedAddress, dispatch])

  if (!nfts) {
    return <GridPlaceholder />
  }

  const orderedNfts = orderBy(Object.values(nfts), ['id'], ['desc'])

  return (
    <Grid
      gridGap="16px"
      gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
      alignItems="start"
    >
      {orderedNfts.map((nft) => {
        return <CollectibleCard key={nft.id} collectionName={collectionName} nft={nft} />
      })}
    </Grid>
  )
}

export default CollectionNfts
