import { gql } from 'graphql-request'

const lastPairDayIdQuery = gql`
  query lastPairDayIdQuery($pairId: String) {
    pairDayDatas(first: 1, where: { pairAddress: $pairId }) {
      id
    }
  }
`
export default lastPairDayIdQuery
