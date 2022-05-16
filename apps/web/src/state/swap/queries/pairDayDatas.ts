import { gql } from 'graphql-request'

const pairDayDatas = gql`
  query pairDayDatas($pairId: String, $first: Int) {
    pairDayDatas(first: $first, where: { pairAddress: $pairId }, orderBy: date, orderDirection: desc) {
      id
      date
      reserve0
      reserve1
      reserveUSD
      pairAddress {
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }
  }
`
export default pairDayDatas
