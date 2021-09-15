import React from 'react'
import { Redirect, useParams } from 'react-router'
import { useCollectionFromSlug } from 'state/nftMarket/hooks'
import Page from 'components/Layout/Page'
import Header from './Header'
import Filters from './Filters'
import CollectionNfts from './CollectionNfts'

const Collectible = () => {
  const { slug } = useParams<{ slug: string }>()
  const collection = useCollectionFromSlug(slug)

  if (!slug || !collection) {
    return <Redirect to="/404" />
  }

  return (
    <>
      <Header collection={collection} />
      <Page>
        <Filters />
        <CollectionNfts collectionName={collection.name} collectionAddress={collection.address} />
      </Page>
    </>
  )
}

export default Collectible
