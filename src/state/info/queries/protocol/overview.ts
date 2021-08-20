import { getChangeForPeriod, getPercentChange } from 'utils/infoData'
import { ProtocolData } from 'state/info/types'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { useDeltaTimestamps } from 'utils/infoQueryHelpers'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { useMemo } from 'react'

/**
 * Latest Liquidity, Volume and Transaction count
 */
export const PANCAKE_FACTORIES = (block?: string) => {
  const queryString = ` query overview {
      pancakeFactories(
       ${block ? `block: { number: ${block}}` : ``} 
       first: 1) {
        totalTransactions
        totalVolumeUSD
        totalLiquidityUSD
      }
    }`
  return gql(queryString)
}

interface PancakeFactory {
  totalTransactions: string
  totalVolumeUSD: string
  totalLiquidityUSD: string
}

interface GlobalResponse {
  pancakeFactories: PancakeFactory[]
}

const formatPancakeFactoryResponse = (rawPancakeFactory?: PancakeFactory) => {
  if (rawPancakeFactory) {
    return {
      totalTransactions: parseFloat(rawPancakeFactory.totalTransactions),
      totalVolumeUSD: parseFloat(rawPancakeFactory.totalVolumeUSD),
      totalLiquidityUSD: parseFloat(rawPancakeFactory.totalLiquidityUSD),
    }
  }
  return null
}

const useFetchProtocolData = (): {
  loading: boolean
  error: boolean
  data: ProtocolData | undefined
} => {
  // get blocks from historic timestamps
  const [t24, t48] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48])
  const [block24, block48] = blocks ?? []

  // fetch all data
  const { loading, error, data } = useQuery<GlobalResponse>(PANCAKE_FACTORIES())

  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useQuery<GlobalResponse>(PANCAKE_FACTORIES(block24?.number ?? undefined))
  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useQuery<GlobalResponse>(PANCAKE_FACTORIES(block48?.number ?? undefined))

  const anyError = Boolean(error || error24 || error48 || blockError)
  const anyLoading = Boolean(loading || loading24 || loading48)

  const overviewData = formatPancakeFactoryResponse(data?.pancakeFactories?.[0])
  const overviewData24 = formatPancakeFactoryResponse(data24?.pancakeFactories?.[0])
  const overviewData48 = formatPancakeFactoryResponse(data48?.pancakeFactories?.[0])

  const formattedData: ProtocolData | null = useMemo(() => {
    const allDataAvailable = overviewData && overviewData24 && overviewData48
    if (anyError || anyLoading || !blocks || !allDataAvailable) {
      return null
    }

    const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
      overviewData.totalVolumeUSD,
      overviewData24.totalVolumeUSD,
      overviewData48.totalVolumeUSD,
    )

    const liquidityUSDChange = getPercentChange(overviewData.totalLiquidityUSD, overviewData24.totalLiquidityUSD)

    // 24H transactions
    const [txCount, txCountChange] = getChangeForPeriod(
      overviewData.totalTransactions,
      overviewData24.totalTransactions,
      overviewData48.totalTransactions,
    )

    return {
      volumeUSD,
      volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
      liquidityUSD: overviewData.totalLiquidityUSD,
      liquidityUSDChange,
      txCount,
      txCountChange,
    }
  }, [anyError, anyLoading, blocks, overviewData, overviewData24, overviewData48])

  return {
    loading: anyLoading,
    error: anyError,
    data: formattedData,
  }
}

export default useFetchProtocolData
