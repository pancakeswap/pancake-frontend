import { gql, GraphQLClient } from 'graphql-request'
import { Block } from 'state/info/types'

export interface EthPrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

export const ETH_PRICES = gql`
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundles(first: 1, subgraphError: allow) {
      ethPriceUSD
    }
    oneDay: bundles(first: 1, block: { number: $block24 }, subgraphError: allow) {
      ethPriceUSD
    }
    twoDay: bundles(first: 1, block: { number: $block48 }, subgraphError: allow) {
      ethPriceUSD
    }
    oneWeek: bundles(first: 1, block: { number: $blockWeek }, subgraphError: allow) {
      ethPriceUSD
    }
  }
`

interface PricesResponse {
  current: {
    ethPriceUSD: string
  }[]
  oneDay: {
    ethPriceUSD: string
  }[]
  twoDay: {
    ethPriceUSD: string
  }[]
  oneWeek: {
    ethPriceUSD: string
  }[]
}

export async function fetchEthPrices(
  blocks: Block[],
  dataClient: GraphQLClient,
): Promise<{ data: EthPrices | undefined; error: boolean }> {
  try {
    const [block24, block48, blockWeek] = blocks ?? []
    const data = await dataClient.request<PricesResponse>(ETH_PRICES, {
      block24: block24?.number ?? 1,
      block48: block48?.number ?? 1,
      blockWeek: blockWeek?.number ?? 1,
    })

    if (data) {
      return {
        data: {
          current: parseFloat(data.current[0].ethPriceUSD ?? '0'),
          oneDay: parseFloat(data.oneDay[0]?.ethPriceUSD ?? '0'),
          twoDay: parseFloat(data.twoDay[0]?.ethPriceUSD ?? '0'),
          week: parseFloat(data.oneWeek[0]?.ethPriceUSD ?? '0'),
        },
        error: false,
      }
    }
    return {
      data: undefined,
      error: true,
    }
  } catch (e) {
    console.error(e)
    return {
      data: undefined,
      error: true,
    }
  }
}
