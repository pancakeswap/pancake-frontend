import React from 'react'
import { Redirect, useParams } from 'react-router'
import { useCollectionFromSlug } from 'state/nftMarket/hooks'
import Page from 'components/Layout/Page'
import GridPlaceholder from '../components/GridPlaceholder'
import Header from './Header'
import Filters from './Filters'

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
        <GridPlaceholder />
      </Page>
    </>
  )
}

export default Collectible
