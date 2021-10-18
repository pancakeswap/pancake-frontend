import { gql } from 'graphql-request'

const lastPairDayIdQuery = gql`
  query lastPairDayIdQuery($pairId: String) {
    pairDayDatas(first: 1, where: { pairAddress: $pairId }, orderBy: date, orderDirection: desc) {
      id
    }
  }
`
export default lastPairDayIdQuery
