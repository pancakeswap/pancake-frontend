import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import store from 'state'
import { fetchCollection } from 'state/nftMarket/reducer'
import Collection from 'views/Nft/market/Collection'

const CollectionPage = () => {
  return <Collection />
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { collectionAddress } = params
  if (typeof collectionAddress !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    await store.dispatch(fetchCollection(collectionAddress))

    return {
      props: {
        initialReduxState: store.getState(),
      },
      revalidate: 60 * 60 * 6, // 6 hours
    }
  } catch (error) {
    return {
      props: {},
      revalidate: 60,
    }
  }
}

export default CollectionPage
