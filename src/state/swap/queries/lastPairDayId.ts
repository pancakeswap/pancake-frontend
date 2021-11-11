import { gql } from 'graphql-request'

const lastPairDayId = gql`
  query lastPairDayId($pairId: String) {
    pairDayDatas(first: 1, where: { pairAddress: $pairId }, orderBy: date, orderDirection: desc) {
      id
    }
  }
`
export default lastPairDayId
