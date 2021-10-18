import { gql } from 'graphql-request'

const lastPairDayDatasQuery = gql`
  query lastPairDayDatasQuery($pairId: String, $first: Int) {
    pairDayDatas(first: $first, where: { pairAddress: $pairId }, orderBy: date, orderDirection: desc) {
      id
      date
      pairAddress {
        token0 {
          id
        }
        token1 {
          id
        }
        name
        timestamp
        token0Price
        token1Price
      }
    }
  }
`
export default lastPairDayDatasQuery
