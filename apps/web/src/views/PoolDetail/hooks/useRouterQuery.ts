import { useRouter } from 'next/router'
import { useChainIdByQuery } from 'state/info/hooks'

export const useRouterQuery = () => {
  const router = useRouter()
  const { id } = router.query
  const chainId = useChainIdByQuery()

  return {
    id: id as string,
    chainId,
  }
}
