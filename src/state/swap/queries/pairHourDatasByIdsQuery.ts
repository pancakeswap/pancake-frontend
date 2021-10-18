import { gql } from 'graphql-request'

const pairHourDatasByIdsQuery = gql`
  query pairHourDatasByIdsQuery($pairIds: [String]) {
    pairHourDatas(where: { id_in: $pairIds }, orderBy: hourStartUnix, orderDirection: desc) {
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
export default pairHourDatasByIdsQuery
