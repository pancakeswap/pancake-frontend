import { gql } from 'graphql-request'

const pairDayDatasByIdsQuery = gql`
  query pairDayDatasByIdsQuery($pairIds: [String]) {
    pairDayDatas(where: { pairAddress_in: $pairIds }) {
      id
      date
      pairAddress {
        name
        timestamp
        token0Price
        token1Price
      }
    }
  }
`
export default pairDayDatasByIdsQuery
