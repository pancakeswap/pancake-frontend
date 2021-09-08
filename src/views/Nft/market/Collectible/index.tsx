import React from 'react'
import { Redirect, useParams } from 'react-router'
import random from 'lodash/random'
import { Grid } from '@pancakeswap/uikit'
import nfts from 'config/constants/nfts'
import { Nft } from 'config/constants/nfts/types'
import { getCollectionFromSlug } from 'config/constants/nfts/helpers'
import Page from 'components/Layout/Page'
import { CollectibleCard } from '../components/CollectibleCard'
import Header from './Header'

// Tmp
const randomPrice = random(1, 11, true)

const Collectible = () => {
  const { slug } = useParams<{ slug: string }>()
  const { key, collection } = getCollectionFromSlug(slug)

  if (!slug || !collection) {
    return <Redirect to="/404" />
  }

  const nftList = nfts[key]

  return (
    <>
      <Header collection={collection} />
      <Page>
        <Grid gridGap="16px" gridTemplateColumns={['1fr', null, null, null, 'repeat(4,1fr)']}>
          {nftList.map((nft: Nft) => (
            <CollectibleCard key={nft.name} collectible={{ name: collection.name, cost: randomPrice, nft }} />
          ))}
        </Grid>
      </Page>
    </>
  )
}

export default Collectible
