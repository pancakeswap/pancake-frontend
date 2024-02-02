import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useNetwork'

const GITHUB_ENDPOINT =
  'https://raw.githubusercontent.com/pancakeswap/pancake-frontend/develop/apps/aptos/config/constants/lpAprs'

const useLpRewardsAprs = () => {
  const chainId = useActiveChainId()

  const { data: lpRewardsAprs } = useQuery({
    queryKey: ['aptosLpAprs', chainId],

    queryFn: async () => {
      const response = await fetch(`${GITHUB_ENDPOINT}/${chainId}.json`)

      if (response.ok) {
        const result = await response.json()
        return result
      }

      // Incase API not work, return local lpAprs json.
      const importLocalLpAprsData = (await import(`../../../config/constants/lpAprs/${chainId}.json`)).default
      if (importLocalLpAprsData) {
        return importLocalLpAprsData
      }

      return {}
    },

    enabled: Boolean(chainId),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return lpRewardsAprs ?? {}
}

export default useLpRewardsAprs
