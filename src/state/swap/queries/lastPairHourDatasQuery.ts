import { gql } from 'graphql-request'

const lastPairHourDatasQuery = gql`
  query lastPairHourDatasQuery($pairId: String, $first: Int) {
    pairHourDatas(first: $first, where: { pair: $pairId }, orderBy: hourStartUnix, orderDirection: desc) {
      id
      hourStartUnix
      reserve0
      reserve1
      pair {
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
export default lastPairHourDatasQuery
