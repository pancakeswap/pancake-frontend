import { gql } from 'graphql-request'

const pairHourDatasByIds = gql`
  query pairHourDatasByIds($pairIds: [String]) {
    pairHourDatas(where: { id_in: $pairIds }, orderBy: hourStartUnix, orderDirection: desc) {
      id
      hourStartUnix
      reserve0
      reserve1
      reserveUSD
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
export default pairHourDatasByIds
