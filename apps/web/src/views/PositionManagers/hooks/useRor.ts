import type { ChainId } from '@pancakeswap/chains'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Evaluate } from '@wagmi/core/internal'
import { VAULT_API_ENDPOINT } from 'config/constants/endpoints'
import type { Address, ExactPartial } from 'viem'
import type { UseQueryParameters } from 'wagmi/query'

type RORPayload = {
  vault: Address | undefined
  chainId: ChainId
}
type RecursiveDeps<deps extends readonly unknown[]> = deps extends [infer dep, ...infer rest]
  ? [dep] | [dep, ...RecursiveDeps<rest>]
  : []

export function createQueryKey<key extends string, deps extends readonly unknown[]>(id: key) {
  return (deps?: RecursiveDeps<deps>) => [id, ...(deps || [])] as unknown as [key, ...deps]
}

const getVaultsQueryKey = createQueryKey<'rate-of-return', [ExactPartial<RORPayload>]>('rate-of-return')

type GetVaultsQueryKey = ReturnType<typeof getVaultsQueryKey>

interface VaultData {
  earliest: number
  timestamp: number
  token0PerShare: string
  token1PerShare: string
  usd: string
  vault: string
}

type VaultDataArray = VaultData[]
type RateOfReturnReturnType = VaultDataArray

export type UseRorReturnType<selectData = RateOfReturnReturnType> = UseQueryResult<selectData, Error>

export type UseRorParameters<selectData = RateOfReturnReturnType> = Evaluate<
  RORPayload & UseQueryParameters<Evaluate<RateOfReturnReturnType>, Error, selectData, GetVaultsQueryKey>
>

export const useRor = <selectData = RateOfReturnReturnType>(parameters: UseRorParameters<selectData>) => {
  const { vault, chainId, ...query } = parameters

  return useQuery({
    ...query,
    queryKey: getVaultsQueryKey([
      {
        vault,
        chainId,
      },
    ]),
    queryFn: async ({ queryKey }) => {
      const { vault: qVault, chainId: qChainId } = queryKey[1]

      if (!qVault || !qChainId) {
        throw new Error('Missing vault history params')
      }
      const providerQuotes = await fetchVaultHistory({
        vault: qVault,
        chainId: qChainId,
        startTimestamp: 1711915200,
        endTimestamp: 1718664640,
      })

      return providerQuotes
    },
    refetchInterval: 40 * 1_000,
    staleTime: 40 * 1_000,
    enabled: Boolean(vault && chainId),
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
