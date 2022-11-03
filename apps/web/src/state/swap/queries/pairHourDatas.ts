import { gql } from 'graphql-request'

const pairHourDatas = gql`
  query pairHourDatas($pairId: String, $first: Int) {
    pairHourDatas(first: $first, where: { pair: $pairId }, orderBy: hourStartUnix, orderDirection: desc) {
      id
      hourStartUnix
      reserve0
      reserve1
      reserveUSD
    }
  }
`
export default pairHourDatas
