import { gql } from 'graphql-request'

const pairHourDatasByIds = gql`
  query pairHourDatasByIds($pairIds: [ID!]) {
    pairHourDatas(where: { id_in: $pairIds }, orderBy: hourStartUnix, orderDirection: desc) {
      id
      hourStartUnix
      reserve0
      reserve1
      reserveUSD
    }
  }
`

/**
 * Hack to rename token0Price and token1Price to reserve0 and reserve1, in order to get the price by dividing in js
 */
export const stableSwapPairHourDatasByIds = gql`
  query pairHourDatasByIds($pairIds: [ID!]) {
    pairHourDatas(where: { id_in: $pairIds }, orderBy: hourStartUnix, orderDirection: desc) {
      id
      hourStartUnix
      reserve0: token0Price
      reserve1: token1Price
      reserveUSD
    }
  }
`
export default pairHourDatasByIds
