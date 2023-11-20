import { GetStaticProps } from 'next'
// eslint-disable-next-line camelcase
import { getCollections } from 'state/nftMarket/helpers'
import PancakeCollectiblesPageRouter from 'views/Profile/components/PancakeCollectiblesPageRouter'
import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { getProfileContract } from 'utils/contractHelpers'
import { viemServerClients } from 'utils/viem.server'
import { ChainId } from '@pancakeswap/chains'
import { ContractFunctionResult } from 'viem'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { dehydrate, QueryClient } from '@tanstack/react-query'

const PancakeCollectiblesPage = () => {
  return <PancakeCollectiblesPageRouter />
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()

  const fetchedCollections = await getCollections()
  if (!fetchedCollections || !Object.keys(fetchedCollections).length) {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 60,
    }
  }

  try {
    const profileContract = getProfileContract()
    const nftRole = await profileContract.read.NFT_ROLE()

    const collectionRoles = (await viemServerClients[ChainId.BSC].multicall({
      contracts: Object.keys(fetchedCollections).map((collectionAddress) => {
        return {
          abi: pancakeProfileABI,
          address: getPancakeProfileAddress(),
          functionName: 'hasRole',
          args: [nftRole, collectionAddress],
        }
      }),
      allowFailure: false,
    })) as ContractFunctionResult<typeof pancakeProfileABI, 'hasRole'>[]

    const pancakeCollectibles = Object.values(fetchedCollections).filter((collection, index) => {
      return collectionRoles[index]
    })

    queryClient.setQueryData(['pancakeCollectibles'], pancakeCollectibles)

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 60 * 60 * 12, // 12 hours
    }
  } catch (error) {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 60,
    }
  }
}

export default PancakeCollectiblesPage
