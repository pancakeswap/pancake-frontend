import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { Collection } from 'state/nftMarket/types'
import { useGetNftFilters } from 'state/nftMarket/hooks'
import Filters from './Filters'
import CollectionNfts from './CollectionNfts'

interface CollectionWrapperProps {
  collection: Collection
}

const CollectionWrapper: React.FC<CollectionWrapperProps> = ({ collection }) => {
  const nftFilters = useGetNftFilters(collection.address)

  return (
    <>
      <Filters collection={collection} />
      {isEmpty(nftFilters?.attributes) ? <CollectionNfts collection={collection} /> : <div>Filtered</div>}
    </>
  )
}

export default CollectionWrapper
