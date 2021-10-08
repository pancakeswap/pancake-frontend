import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { Collection } from 'state/nftMarket/types'
import { useGetNftFilters } from 'state/nftMarket/hooks'
import Filters from './Filters'
import CollectionNfts from './CollectionNfts'
import FilteredCollectionNfts from './FilteredCollectionNfts'

interface CollectionWrapperProps {
  collection: Collection
}

const CollectionWrapper: React.FC<CollectionWrapperProps> = ({ collection }) => {
  const nftFilters = useGetNftFilters()

  return (
    <>
      <Filters collection={collection} />
      {isEmpty(nftFilters) ? (
        <CollectionNfts collection={collection} />
      ) : (
        <FilteredCollectionNfts collection={collection} />
      )}
    </>
  )
}

export default CollectionWrapper
