import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import { safeGetAddress } from 'utils'
import { pancakeBunniesAddress } from '../../constants'
import IndividualPancakeBunnyPage from './PancakeBunnyPage'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  const router = useRouter()
  // For PancakeBunnies tokenId in url is really bunnyId
  const { collectionAddress, tokenId } = router.query

  if (router.isFallback) {
    return <PageLoader />
  }

  const isPBCollection = safeGetAddress(String(collectionAddress)) === safeGetAddress(pancakeBunniesAddress)
  if (isPBCollection) {
    return <IndividualPancakeBunnyPage bunnyId={String(tokenId)} />
  }

  return <IndividualNFTPage collectionAddress={safeGetAddress(collectionAddress as string)} tokenId={String(tokenId)} />
}

export default IndividualNFTPageRouter
