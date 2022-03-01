import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import Overview from './Overview'

const ProposalPageRouter = () => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader />
  }

  return <Overview />
}

export default ProposalPageRouter
