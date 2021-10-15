import { gql } from 'graphql-request'

const pairHourDatasByIdsQuery = gql`
  query pairHourDatasByIdsQuery($pairIds: [String]) {
    pairHourDatas(where: { pair_in: $pairIds }) {
      id
      hourStartUnix
      pair {
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
export default pairHourDatasByIdsQuery
