import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import PancakeCollectibles from './PancakeCollectibles'

const PancakeCollectiblesPageRouter = () => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader />
  }

  return <PancakeCollectibles />
}

export default PancakeCollectiblesPageRouter
