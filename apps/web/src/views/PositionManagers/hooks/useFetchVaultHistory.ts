import type { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { VAULT_API_ENDPOINT } from 'config/constants/endpoints'
import type { ExactPartial } from 'viem'
import { useChainId } from 'wagmi'

enum SnapShotIntervals {
  SEVENTH_DAY = 'SEVENTH_DAY',
  THIRTY_DAY = 'THIRTY_DAY',
  INCEPTION_DAY = 'INCEPTION_DAY',
}

type RORPayload = {
  chainId: ChainId
}

export type VaultHistorySnapshots = {
  rorData: VaultData[]
  isVaultDataLoading: boolean
}

export type RorUSDMap = { [interval in SnapShotIntervals]: string }

type RecursiveDeps<deps extends readonly unknown[]> = deps extends [infer dep, ...infer rest]
  ? [dep] | [dep, ...RecursiveDeps<rest>]
  : []

export function createQueryKey<key extends string, deps extends readonly unknown[]>(id: key) {
  return (deps?: RecursiveDeps<deps>) => [id, ...(deps || [])] as unknown as [key, ...deps]
}

const getVaultsQueryKey = createQueryKey<'rate-of-return', [ExactPartial<RORPayload>]>('rate-of-return')

export interface VaultData {
  earliest: number
  period: SnapShotIntervals
  timestamp: number
  token0PerShare: string
  token1PerShare: string
  usd: string
  vault: string
}

export const useFetchVaultHistory = () => {
  const chainId = useChainId()
  return useQuery({
    queryKey: getVaultsQueryKey([{ chainId }]),

    queryFn: async () => {
      try {
        const providerQuotes = await fetchVaultHistory({ chainId })

        return providerQuotes
      } catch (error) {
        console.error(`Fetch fetch Vault Histrory API Error: ${error}`)
        return []
      }
    },
    refetchInterval: 20 * 1_000,
    enabled: Boolean(chainId),
    initialData: [],
  })
}

async function fetchVaultHistory(payload: { chainId: ChainId }): Promise<VaultData[]> {
  const response = await fetch(`${VAULT_API_ENDPOINT}/api/history?chainId=${payload.chainId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const result = await response.json()
  return result
}
