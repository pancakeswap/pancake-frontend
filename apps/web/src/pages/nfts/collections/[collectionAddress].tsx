import { GetStaticPaths, GetStaticProps } from 'next'
// eslint-disable-next-line camelcase
import { getCollection } from 'state/nftMarket/helpers'
import CollectionPageRouter from 'views/Nft/market/Collection/CollectionPageRouter'
import { dehydrate, QueryClient } from '@tanstack/react-query'

const CollectionPage = () => {
  return <CollectionPageRouter />
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient()
  const collectionAddress = params?.collectionAddress
  if (typeof collectionAddress !== 'string') {
    return {
      notFound: true,
    }
  }

  try {
    const collectionData = await queryClient.fetchQuery({
      queryKey: ['nftMarket', 'collections', collectionAddress.toLowerCase()],
      queryFn: () => getCollection(collectionAddress),
    })

    if (collectionData) {
      return {
        props: {
          dehydratedState: dehydrate(queryClient),
        },
        revalidate: 60 * 60 * 6, // 6 hours
      }
    }
    return {
      notFound: true,
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true,
      revalidate: 60,
    }
  }
}

export default CollectionPage
