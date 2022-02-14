import { GetStaticPaths, GetStaticProps } from 'next'
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

    const state = store.getState()

    return {
      props: {
        // Note: only include the data needed for the page, otherwise it will override the user preset data
        initialReduxState: {
          nftMarket: state.nftMarket,
        },
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
