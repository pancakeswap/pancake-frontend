import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import Collection from './index'

const CollectionPageRouter = () => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader />
  }

  return <Collection />
}

export default CollectionPageRouter
