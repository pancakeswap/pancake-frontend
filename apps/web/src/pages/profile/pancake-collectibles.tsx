import { GetStaticProps, InferGetStaticPropsType } from 'next'
// eslint-disable-next-line camelcase
import { unstable_serialize, SWRConfig } from 'swr'
import { getCollections } from 'state/nftMarket/helpers'
import multicall from 'utils/multicall'
import PancakeCollectiblesPageRouter from 'views/Profile/components/PancakeCollectiblesPageRouter'
import profileABI from 'config/abi/pancakeProfile.json'
import { getProfileContract } from 'utils/contractHelpers'

const PancakeCollectiblesPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <PancakeCollectiblesPageRouter />
    </SWRConfig>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const fetchedCollections = await getCollections()
  if (!fetchedCollections || !Object.keys(fetchedCollections).length) {
    return {
      props: {
        fallback: {},
      },
      revalidate: 60,
    }
  }

  try {
    const profileContract = getProfileContract(null)
    const nftRole = await profileContract.NFT_ROLE()
    const collectionsNftRoleCalls = Object.keys(fetchedCollections).map((collectionAddress) => {
      return {
        address: profileContract.address,
        name: 'hasRole',
        params: [nftRole, collectionAddress],
      }
    })
    const collectionRolesRaw = await multicall(profileABI, collectionsNftRoleCalls)
    const collectionRoles = collectionRolesRaw.flat()

    const pancakeCollectibles = Object.values(fetchedCollections).filter((collection, index) => {
      return collectionRoles[index]
    })

    return {
      props: {
        fallback: {
          [unstable_serialize(['pancakeCollectibles'])]: pancakeCollectibles,
        },
      },
      revalidate: 60 * 60 * 12, // 12 hours
    }
  } catch (error) {
    return {
      props: {
        fallback: {},
      },
      revalidate: 60,
    }
  }
}

export default PancakeCollectiblesPage
