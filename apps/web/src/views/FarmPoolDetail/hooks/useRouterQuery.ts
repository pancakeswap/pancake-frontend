import { useRouter } from 'next/router'
import { useChainIdByQuery } from 'state/info/hooks'

export const useRouterQuery = () => {
  const router = useRouter()
  const { pools } = router.query
  const chainId = useChainIdByQuery()

  return {
    pools: pools as string,
    chainId,
  }
}
