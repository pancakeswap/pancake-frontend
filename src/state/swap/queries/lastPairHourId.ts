import { gql } from 'graphql-request'

const lastPairHourId = gql`
  query lastPairHourId($pairId: String) {
    pairHourDatas(first: 1, where: { pair: $pairId }, orderBy: hourStartUnix, orderDirection: desc) {
      id
    }
  }
`
export default lastPairHourId
