import IndividualNFT from 'views/Nft/market/Collection/IndividualNFTPage'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getNftApi } from 'state/nftMarket/helpers'
import { NftToken } from 'state/nftMarket/types'
// eslint-disable-next-line camelcase
import { SWRConfig, unstable_serialize } from 'swr'

const IndividualNFTPage = ({ fallback }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <IndividualNFT />
    </SWRConfig>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { collectionAddress, tokenId } = params

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

  const nft: NftToken = {
    tokenId,
    collectionAddress,
    collectionName: metadata.collection.name,
    name: metadata.name,
    description: metadata.description,
    image: metadata.image,
    attributes: metadata.attributes,
  }

  return {
    props: {
      fallback: {
        [unstable_serialize(['nft', nft.collectionAddress, nft.tokenId])]: nft,
      },
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}

export default IndividualNFTPage
