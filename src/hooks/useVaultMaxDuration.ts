import { useSWRContract, immutableMiddleware } from 'hooks/useSWRContract'
import { useCakeVaultContract } from 'hooks/useContract'

export function useVaultMaxDuration() {
  const cakeVaultContract = useCakeVaultContract(false)

  const { data } = useSWRContract([cakeVaultContract, 'MAX_LOCK_DURATION'], {
    use: [immutableMiddleware],
  })

  return data
}
