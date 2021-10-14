import { gql } from 'graphql-request'

const lastPairHourDatasQuery = gql`
  query lastPairHourDatasQuery($pairId: String, $first: Int) {
    pairHourDatas(first: $first, where: { pair: $pairId }) {
      id
      hourStartUnix
      pair {
        name
        timestamp
        token0Price
        token1Price
      }
    }
  }
`
export default lastPairHourDatasQuery
