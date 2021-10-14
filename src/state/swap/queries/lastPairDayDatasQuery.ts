import { gql } from 'graphql-request'

const lastPairDayDatasQuery = gql`
  query lastPairDayDatasQuery($pairId: String, $first: Int) {
    pairDayDatas(first: $first, where: { pairAddress: $pairId }) {
      id
      date
      pairAddress {
        name
        timestamp
        token0Price
        token1Price
      }
    }
  }
`
export default lastPairDayDatasQuery
