import React from 'react'
import { Collection } from 'state/nftMarket/types'
import Page from 'components/Layout/Page'
import Filters from '../Filters'
import CollectionNfts from '../CollectionNfts'

interface ItemsProps {
  collection: Collection
}

const Items: React.FC<ItemsProps> = ({ collection }) => (
  <Page>
    <Filters collection={collection} />
    <CollectionNfts collectionName={collection.name} collectionAddress={collection.address} />
  </Page>
)

export default Items
