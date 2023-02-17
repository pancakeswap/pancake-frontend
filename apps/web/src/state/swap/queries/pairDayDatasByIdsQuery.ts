import { gql } from 'graphql-request'

const pairDayDatasByIdsQuery = gql`
  query pairDayDatasByIdsQuery($pairIds: [ID!]) {
    pairDayDatas(where: { id_in: $pairIds }, orderBy: date, orderDirection: desc) {
      id
      date
      reserve0
      reserve1
      reserveUSD
    }
  }
`

/**
 * Hack to rename token0Price and token1Price to reserve0 and reserve1, in order to get the price by dividing in js
 */
export const stableSwapPairDayDatasByIdsQuery = gql`
  query pairDayDatasByIdsQuery($pairIds: [ID!]) {
    pairDayDatas(where: { id_in: $pairIds }, orderBy: date, orderDirection: desc) {
      id
      date
      reserve0: token0Price
      reserve1: token1Price
      reserveUSD
    }
  }
`
export default pairDayDatasByIdsQuery
