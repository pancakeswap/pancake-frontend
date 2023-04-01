import { gql, GraphQLClient } from 'graphql-request'
import { ChainId } from '@pancakeswap/sdk'
import { Block } from 'state/info/types'
import { ProtocolData } from '../../types'
import { getPercentChange } from '../../utils/data'
import { fetchTVLOffset } from './derived'

export const GLOBAL_DATA = (block?: string | number) => {
  const queryString = ` query uniswapFactories {
      factories(
       ${block !== undefined ? `block: { number: ${block}}` : ``} 
       first: 1, subgraphError: allow) {
        txCount
        totalVolumeUSD
        totalFeesUSD
        totalValueLockedUSD
      }
    }`
  return gql`
    ${queryString}
  `
}

interface GlobalResponse {
  factories: {
    txCount: string
    totalVolumeUSD: string
    totalFeesUSD: string
    totalValueLockedUSD: string
  }[]
}

export async function fetchProtocolData(
  dataClient: GraphQLClient,
  chainId: ChainId,
  blocks: Block[],
): Promise<{
  error: boolean
  data: ProtocolData | undefined
}> {
  try {
    // Aggregate TVL in inaccurate pools. Offset Uniswap aggregate TVL by this amount.
    const tvlOffset = await fetchTVLOffset(dataClient, chainId)

    const [block24, block48] = blocks ?? []

    // fetch all data
    const data = await dataClient.request<GlobalResponse>(GLOBAL_DATA())

    const data24 = await dataClient.request<GlobalResponse>(GLOBAL_DATA(block24?.number ?? 0))

    const data48 = await dataClient.request<GlobalResponse>(GLOBAL_DATA(block48?.number ?? 0))

    const parsed = data?.factories?.[0]
    const parsed24 = data24?.factories?.[0]
    const parsed48 = data48?.factories?.[0]

    // volume data
    const volumeUSD =
      parsed && parsed24
        ? parseFloat(parsed.totalVolumeUSD) - parseFloat(parsed24.totalVolumeUSD)
        : parseFloat(parsed.totalVolumeUSD)

    const volumeOneWindowAgo =
      parsed24?.totalVolumeUSD && parsed48?.totalVolumeUSD
        ? parseFloat(parsed24.totalVolumeUSD) - parseFloat(parsed48.totalVolumeUSD)
        : undefined

    const volumeUSDChange =
      volumeUSD && volumeOneWindowAgo ? ((volumeUSD - volumeOneWindowAgo) / volumeOneWindowAgo) * 100 : 0

    // total value locked
    const tvlUSDChange = getPercentChange(parsed?.totalValueLockedUSD, parsed24?.totalValueLockedUSD)

    // 24H transactions
    const txCount =
      parsed && parsed24 ? parseFloat(parsed.txCount) - parseFloat(parsed24.txCount) : parseFloat(parsed.txCount)

    const txCountOneWindowAgo =
      parsed24 && parsed48 ? parseFloat(parsed24.txCount) - parseFloat(parsed48.txCount) : undefined

    const txCountChange =
      txCount && txCountOneWindowAgo ? getPercentChange(txCount.toString(), txCountOneWindowAgo.toString()) : 0

    const feesOneWindowAgo =
      parsed24 && parsed48 ? parseFloat(parsed24.totalFeesUSD) - parseFloat(parsed48.totalFeesUSD) : undefined

    const feesUSD =
      parsed && parsed24
        ? parseFloat(parsed.totalFeesUSD) - parseFloat(parsed24.totalFeesUSD)
        : parseFloat(parsed.totalFeesUSD)

    const feeChange =
      feesUSD && feesOneWindowAgo ? getPercentChange(feesUSD.toString(), feesOneWindowAgo.toString()) : 0

    const formattedData = {
      volumeUSD,
      volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
      tvlUSD: parseFloat(parsed?.totalValueLockedUSD) - tvlOffset,
      tvlUSDChange,
      feesUSD,
      feeChange,
      txCount,
      txCountChange,
    }

    return {
      error: false,
      data: formattedData,
    }
  } catch (e) {
    console.error(e)
    return {
      error: false,
      data: undefined,
    }
  }
}
