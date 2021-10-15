import { gql } from 'graphql-request'

const pairDayDatasByIdsQuery = gql`
  query pairDayDatasByIdsQuery($pairIds: [String]) {
    pairDayDatas(where: { pairAddress_in: $pairIds }) {
      id
      date
      pairAddress {
        token0 {
          id
        }
        token1 {
          id
        }
        name
        timestamp
        token0Price
        token1Price
      }
    }
  }
`
export default pairDayDatasByIdsQuery
