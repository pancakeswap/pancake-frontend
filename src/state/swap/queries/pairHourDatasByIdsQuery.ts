import { gql } from 'graphql-request'

const pairHourDatasByIdsQuery = gql`
  query pairHourDatasByIdsQuery($pairIds: [String]) {
    pairHourDatas(where: { pair_in: $pairIds }) {
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
export default pairHourDatasByIdsQuery
