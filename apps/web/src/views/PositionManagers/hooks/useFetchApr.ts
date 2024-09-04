import { ChainId } from '@pancakeswap/chains'
import {
  POSITION_MANAGER_API,
  SUPPORTED_CHAIN_IDS as POSITION_MANAGERS_SUPPORTED_CHAINS,
} from '@pancakeswap/position-managers'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { Address } from 'viem'

export interface AprDataInfo {
  token0: number
  token1: number
  rewardAmount: number
  chainId: ChainId
  lpAddress: Address
  calculationDays: number
}

export interface AprData {
  data: AprDataInfo[]
  fallbackData: AprDataInfo[]
  isLoading: boolean
  specificData: Record<number, AprDataInfo[]>
  refetch: () => void
}

export const TIME_WINDOW_DEFAULT = 3
export const TIME_WINDOW_FALLBACK = 0

const fetchAllSpecificTimeWindow = async (timeWindows: number[], chainId?: number) => {
  const data = await Promise.all(
    timeWindows.map(async (timeWindow) => {
      const response = await fetch(`${POSITION_MANAGER_API}?chainId=${chainId}&item=feeAvg`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avgFeeCalculationDays: timeWindow,
        }),
      })
      const result: AprDataInfo[] = await response.json()
      return result
    }),
  )
  const result: Record<number, AprDataInfo[]> = {}
  timeWindows.forEach((d, index) => {
    result[d] = data[index]
  })
  return result
}

export const useFetchApr = (timeWindows: number[]): AprData => {
  const { chainId } = useActiveChainId()
  const supportedChain = useMemo((): boolean => {
    const chainIds = POSITION_MANAGERS_SUPPORTED_CHAINS
    return Boolean(chainId && chainIds.includes(chainId))
  }, [chainId])

  const { data, isPending, refetch } = useQuery({
    queryKey: ['/fetch-position-manager-apr', chainId],

    queryFn: async () => {
      try {
        const response = await fetch(`${POSITION_MANAGER_API}?chainId=${chainId}&item=feeAvg`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avgFeeCalculationDays: TIME_WINDOW_DEFAULT,
          }),
        })

        const result: AprDataInfo[] = await response.json()
        return result
      } catch (error) {
        console.error(`Fetch fetch APR API Error: ${error}`)
        return []
      }
    },

    enabled: supportedChain,
    refetchOnWindowFocus: false,
  })

  const { data: fallbackData, isPending: isFallbackLoading } = useQuery({
    queryKey: ['/fetch-position-manager-apr-fallback', chainId],

    queryFn: async () => {
      try {
        const response = await fetch(`${POSITION_MANAGER_API}?chainId=${chainId}&item=feeAvg`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avgFeeCalculationDays: TIME_WINDOW_FALLBACK,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          return Array.isArray(result) ? (result as AprDataInfo[]) : []
        }
        throw new Error(`Failed to fetch data: Response returned an error, Status: ${response.status}`)
      } catch (error) {
        console.error(`Fetch fetch APR API Error: ${error}`)
        return []
      }
    },

    enabled: supportedChain,
    refetchOnWindowFocus: false,
  })

  const { data: specificData, isPending: isSpecificLoading } = useQuery({
    queryKey: ['/fetch-position-manager-apr-specific', chainId],

    queryFn: async () => {
      try {
        const result = await fetchAllSpecificTimeWindow(timeWindows, chainId)
        return result
      } catch (error) {
        console.error(`Fetch fetch APR API Error: ${error}`)
        return []
      }
    },

    enabled: supportedChain,
    refetchOnWindowFocus: false,
  })

  return {
    data: data ?? [],
    isLoading: isPending || isFallbackLoading || isSpecificLoading,
    refetch,
    fallbackData: fallbackData ?? [],
    specificData: specificData ?? {},
  }
}
