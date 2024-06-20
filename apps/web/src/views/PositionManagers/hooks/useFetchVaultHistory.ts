import type { ChainId } from '@pancakeswap/chains'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Evaluate } from '@wagmi/core/internal'
import { VAULT_API_ENDPOINT } from 'config/constants/endpoints'
import type { Address, ExactPartial } from 'viem'
import type { UseQueryParameters } from 'wagmi/query'
import { floorToUTC00 } from '../utils/floorCurrentTimestamp'

type RORPayload = {
  vault: Address | undefined
  chainId: ChainId
  earliest: number | undefined
}
type RecursiveDeps<deps extends readonly unknown[]> = deps extends [infer dep, ...infer rest]
  ? [dep] | [dep, ...RecursiveDeps<rest>]
  : []

export function createQueryKey<key extends string, deps extends readonly unknown[]>(id: key) {
  return (deps?: RecursiveDeps<deps>) => [id, ...(deps || [])] as unknown as [key, ...deps]
}

const getVaultsQueryKey = createQueryKey<'rate-of-return', [ExactPartial<RORPayload>]>('rate-of-return')

type GetVaultsQueryKey = ReturnType<typeof getVaultsQueryKey>

export interface VaultData {
  earliest: number
  timestamp: number
  token0PerShare: string
  token1PerShare: string
  usd: string
  vault: string
}

export type UseRorReturnType<selectData = VaultData[]> = UseQueryResult<selectData, Error>

export type UseRorParameters<selectData = VaultData[]> = Evaluate<
  RORPayload & UseQueryParameters<Evaluate<VaultData[]>, Error, selectData, GetVaultsQueryKey>
>

export const useFetchVaultHistory = <selectData = VaultData[]>(parameters: UseRorParameters<selectData>) => {
  const { vault, chainId, earliest, ...query } = parameters

  return useQuery({
    ...query,
    queryKey: getVaultsQueryKey([{ vault, chainId }]),

    queryFn: async () => {
      if (!vault || !earliest) throw new Error('Missing vault history params')

      const today = floorToUTC00(Date.now()) / 1000
      const earliestTimestamp = floorToUTC00(earliest) / 1000

      try {
        const providerQuotes = await fetchVaultHistory({
          vault,
          chainId,
          startTimestamp: earliestTimestamp,
          endTimestamp: today,
        })

        return providerQuotes
      } catch (error) {
        console.error(`Fetch fetch Vault Histrory API Error: ${error}`)
        return []
      }
    },
    refetchInterval: 20 * 1_000,
    enabled: Boolean(vault && chainId),
    initialData: [],
  })
}

async function fetchVaultHistory(payload: {
  vault: Address
  startTimestamp: number
  endTimestamp: number
  chainId: ChainId
}): Promise<VaultData[]> {
  const response = await fetch(
    `${VAULT_API_ENDPOINT}/api/history?vault=${payload.vault.toLowerCase()}&startTimestamp=${
      payload.startTimestamp
    }&endTimestamp=${payload.endTimestamp}&chainId=${payload.chainId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
  const result = await response.json()
  return result
}
