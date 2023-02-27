import { gql } from 'graphql-request'

const lastPairDayId = gql`
  query lastPairDayId($pairId: Bytes) {
    pairDayDatas(first: 1, where: { pairAddress: $pairId }, orderBy: date, orderDirection: desc) {
      id
    }
  }
`
export default lastPairDayId
