import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { ProtocolData } from 'state/info/types'
import { infoClient } from 'utils/graphql'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getChangeForPeriod, getPercentChange } from 'views/Info/utils/infoDataHelpers'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'

interface PancakeFactory {
  totalTransactions: string
  totalVolumeUSD: string
  totalLiquidityUSD: string
}

interface OverviewResponse {
  pancakeFactories: PancakeFactory[]
}

/**
 * Latest Liquidity, Volume and Transaction count
 */
const getOverviewData = async (block?: number): Promise<{ data?: OverviewResponse; error: boolean }> => {
  try {
    const query = gql`query overview {
      pancakeFactories(
        ${block ? `block: { number: ${block}}` : ``}
        first: 1) {
        totalTransactions
        totalVolumeUSD
        totalLiquidityUSD
      }
    }`
    const data = await infoClient.request<OverviewResponse>(query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch info overview', error)
    return { data: null, error: true }
  }
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

interface ProtocolFetchState {
  error: boolean
  data?: ProtocolData
}

const useFetchProtocolData = (): ProtocolFetchState => {
  const [fetchState, setFetchState] = useState<ProtocolFetchState>({
    error: false,
  })
  const [t24, t48] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48])
  const [block24, block48] = blocks ?? []

  useEffect(() => {
    const fetch = async () => {
      const [{ error, data }, { error: error24, data: data24 }, { error: error48, data: data48 }] = await Promise.all([
        getOverviewData(),
        getOverviewData(block24?.number ?? undefined),
        getOverviewData(block48?.number ?? undefined),
      ])
      const anyError = error || error24 || error48
      const overviewData = formatPancakeFactoryResponse(data?.pancakeFactories?.[0])
      const overviewData24 = formatPancakeFactoryResponse(data24?.pancakeFactories?.[0])
      const overviewData48 = formatPancakeFactoryResponse(data48?.pancakeFactories?.[0])
      const allDataAvailable = overviewData && overviewData24 && overviewData48
      if (anyError || !allDataAvailable) {
        setFetchState({
          error: true,
        })
      } else {
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
        const protocolData: ProtocolData = {
          volumeUSD,
          volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
          liquidityUSD: overviewData.totalLiquidityUSD,
          liquidityUSDChange,
          txCount,
          txCountChange,
        }
        setFetchState({
          error: false,
          data: protocolData,
        })
      }
    }
    const allBlocksAvailable = block24?.number && block48?.number
    if (allBlocksAvailable && !blockError && !fetchState.data) {
      fetch()
    }
  }, [block24, block48, blockError, fetchState])

  return fetchState
}

export default useFetchProtocolData
