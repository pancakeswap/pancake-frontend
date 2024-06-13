/* eslint-disable no-console */
import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'

import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'

export interface UsePoolAvgInfoParams {
  address?: string
  chainId?: ChainId
  enabled?: boolean
}

export const averageArray = (dataToCalculate: number[]): number => {
  let data = [...dataToCalculate]
  // Remove the highest and lowest volume to be more accurate
  if (data.length > 3) {
    data = data.sort((a: number, b: number) => a - b).slice(1, data.length - 1)
  }

  return data.reduce((result, val) => result + val, 0) / data.length
}

interface Info {
  volumeUSD: number
  tvlUSD: number
  feeUSD: number
}

const defaultInfo: Info = {
  volumeUSD: 0,
  tvlUSD: 0,
  feeUSD: 0,
}

export function usePoolAvgInfo({ address = '', chainId, enabled = true }: UsePoolAvgInfoParams) {
  const { data } = useQuery({
    queryKey: ['poolAvgInfo', address, chainId],

    queryFn: async ({ signal }) => {
      if (!chainId) throw new Error('Chain ID not found')
      if (!address) throw new Error('Address not found')

      const chainName = chainIdToExplorerInfoChainName[chainId]
      if (!chainName) {
        throw new Error('Chain name not found')
      }

      const resp = await explorerApiClient.GET('/cached/pools/v3/{chainName}/{address}', {
        signal,
        params: {
          path: {
            address,
            chainName,
          },
        },
      })

      if (!resp.data) {
        console.log('[Failed] Trading volume', address, chainId)
        return defaultInfo
      }

      return {
        volumeUSD: +resp.data.volumeUSD7d / 7,
        tvlUSD: +resp.data.tvlUSD,
        feeUSD: (+resp.data.feeUSD7d - +resp.data.protocolFeeUSD7d) / 7,
      }
    },

    enabled: Boolean(address && chainId && enabled),
    refetchOnWindowFocus: false,
  })

  return data || defaultInfo
}
