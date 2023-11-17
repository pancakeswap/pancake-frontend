import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import {
  POSITION_MANAGER_API,
  SUPPORTED_CHAIN_IDS as POSITION_MANAGERS_SUPPORTED_CHAINS,
} from '@pancakeswap/position-managers'

export interface AprDataInfo {
  token0: number
  token1: number
  chainId: ChainId
  lpAddress: Address
  calculationDays: number
}

export interface AprData {
  data: AprDataInfo[]
  fallbackData: AprDataInfo[]
  isLoading: boolean
  refetch: () => void
}

export const useFetchApr = (): AprData => {
  const { chainId } = useActiveChainId()
  const supportedChain = useMemo((): boolean => {
    const chainIds = POSITION_MANAGERS_SUPPORTED_CHAINS
    return Boolean(chainId && chainIds.includes(chainId))
  }, [chainId])

  const { data, isLoading, refetch } = useQuery(
    ['/fetch-position-manager-apr', chainId],
    async () => {
      try {
        const response = await fetch(`${POSITION_MANAGER_API}/${chainId}/vault/feeAvg`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avgFeeCalculationDays: 1,
          }),
        })

        const result: AprDataInfo[] = await response.json()
        return result
      } catch (error) {
        console.error(`Fetch fetch APR API Error: ${error}`)
        return []
      }
    },
    {
      enabled: supportedChain,
      refetchOnWindowFocus: false,
    },
  )

  const { data: fallbackData, isLoading: isFallbackLoading } = useQuery(
    ['/fetch-position-manager-apr-fallback', chainId],
    async () => {
      try {
        const response = await fetch(`${POSITION_MANAGER_API}/${chainId}/vault/feeAvg`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avgFeeCalculationDays: 0,
          }),
        })

        const result: AprDataInfo[] = await response.json()
        return result
      } catch (error) {
        console.error(`Fetch fetch APR API Error: ${error}`)
        return []
      }
    },
    {
      enabled: supportedChain,
      refetchOnWindowFocus: false,
    },
  )
  return { data: data ?? [], isLoading: isLoading || isFallbackLoading, refetch, fallbackData: fallbackData ?? [] }
}
