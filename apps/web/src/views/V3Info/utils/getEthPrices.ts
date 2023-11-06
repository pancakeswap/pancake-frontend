import { gql, GraphQLClient } from 'graphql-request'
import { Block } from 'state/info/types'

export interface EthPrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

export const ETH_PRICES = (block24?: number, block48?: number, blockWeek?: number) => {
  const dayQueryString = block24
    ? `oneDay: bundles(first: 1, block: { number: ${block24} }) {
      ethPriceUSD
    }`
    : ''

  const twoDayQueryString = block48
    ? `twoDay: bundles(first: 1, block: { number: ${block48} }) {
      ethPriceUSD
    }`
    : ''
  const weekQueryString = blockWeek
    ? `oneWeek: bundles(first: 1, block: { number: ${blockWeek} }) {
      ethPriceUSD
    }`
    : ''
  const queryString = `
  query prices {
    current: bundles(first: 1) {
      ethPriceUSD
    }
    ${dayQueryString}
    ${twoDayQueryString}
    ${weekQueryString}
  }
`
  return gql`
    ${queryString}
  `
}

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
  dataClient: GraphQLClient,
  blocks?: Block[],
): Promise<{ data: EthPrices | undefined; error: boolean }> {
  try {
    const [block24, block48, blockWeek] = blocks ?? []
    const data = await dataClient.request<PricesResponse>(
      ETH_PRICES(block24?.number, block48?.number, blockWeek?.number),
    )

    if (data) {
      return {
        data: {
          current: parseFloat(data.current[0].ethPriceUSD ?? '0'),
          oneDay: parseFloat(data?.oneDay?.[0]?.ethPriceUSD ?? '0'),
          twoDay: parseFloat(data?.twoDay?.[0]?.ethPriceUSD ?? '0'),
          week: parseFloat(data?.oneWeek?.[0]?.ethPriceUSD ?? '0'),
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
