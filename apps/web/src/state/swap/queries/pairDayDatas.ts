import { gql } from 'graphql-request'

const pairDayDatas = gql`
  query pairDayDatas($pairId: Bytes, $first: Int) {
    pairDayDatas(first: $first, where: { pairAddress: $pairId }, orderBy: date, orderDirection: desc) {
      id
      date
      reserve0
      reserve1
      reserveUSD
    }
  }
`

export const stableSwapPairDayDatas = gql`
  query pairDayDatas($pairId: Bytes, $first: Int) {
    pairDayDatas(first: $first, where: { pairAddress: $pairId }, orderBy: date, orderDirection: desc) {
      id
      date
      reserve0: token0Price
      reserve1: token1Price
      reserveUSD
    }
  }
`
export default pairDayDatas
