import React, { useEffect } from 'react'
import { Redirect, useParams } from 'react-router'
import { useAppDispatch } from 'state'
import { useCollectionFromSlug } from 'state/nftMarket/hooks'
import { fetchCollection } from 'state/nftMarket/reducer'
import Page from 'components/Layout/Page'
import Header from './Header'
import Filters from './Filters'
import CollectionNfts from './CollectionNfts'

const Collectible = () => {
  const { slug } = useParams<{ slug: string }>()
  const collection = useCollectionFromSlug(slug)
  const dispatch = useAppDispatch()
  const { address } = collection || {}

  useEffect(() => {
    if (address) {
      dispatch(fetchCollection(address))
    }
  }, [address, dispatch])

  if (!slug || !collection) {
    return <Redirect to="/404" />
  }

  return (
    <>
      <Header collection={collection} />
      <Page>
        <Filters collection={collection} />
        <CollectionNfts collectionName={collection.name} collectionAddress={collection.address} />
      </Page>
    </>
  )
}

export default Collectible
