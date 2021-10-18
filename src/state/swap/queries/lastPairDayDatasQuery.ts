import { gql } from 'graphql-request'

const lastPairDayDatasQuery = gql`
  query lastPairDayDatasQuery($pairId: String, $first: Int) {
    pairDayDatas(first: $first, where: { pairAddress: $pairId }, orderBy: date, orderDirection: desc) {
      id
      date
      reserve0
      reserve1
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
export default lastPairDayDatasQuery
