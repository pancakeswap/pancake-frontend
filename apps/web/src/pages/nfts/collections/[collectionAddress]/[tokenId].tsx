import IndividualNFT from 'views/Nft/market/Collection/IndividualNFTPage'
import { Address } from 'viem'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getCollection, getNftApi } from 'state/nftMarket/helpers'
// eslint-disable-next-line camelcase
import { dehydrate, QueryClient } from '@tanstack/react-query'

const IndividualNFTPage = () => {
  return <IndividualNFT />
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
  const tokenId = params?.tokenId

  if (typeof collectionAddress !== 'string' || typeof tokenId !== 'string') {
    return {
      notFound: true,
    }
  }

  const metadata = await getNftApi(collectionAddress, tokenId)
  if (!metadata) {
    return {
      notFound: true,
      revalidate: 1,
    }
  }

  const collection = await getCollection(collectionAddress)

  if (collection) {
    await queryClient.prefetchQuery({
      queryKey: ['nftMarket', 'collections', collectionAddress.toLowerCase()],
      queryFn: () => collection,
    })
  }

  await queryClient.prefetchQuery({
    queryKey: ['nft', collectionAddress, tokenId],
    queryFn: async () => {
      return {
        tokenId,
        collectionAddress: collectionAddress as Address,
        collectionName: metadata.collection.name,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes,
      }
    },
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}

export default IndividualNFTPage
