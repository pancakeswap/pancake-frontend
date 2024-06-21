import { useRouter } from 'next/router'
import { useChainIdByQuery } from 'state/info/hooks'

export const useRouterQuery = () => {
  const router = useRouter()
  const { version, pools } = router.query
  const chainId = useChainIdByQuery()

  return {
    version,
    pools: pools as string,
    chainId,
  }
}
