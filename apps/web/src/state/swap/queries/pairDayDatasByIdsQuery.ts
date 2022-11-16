import { gql } from 'graphql-request'

const pairDayDatasByIdsQuery = gql`
  query pairDayDatasByIdsQuery($pairIds: [ID!]) {
    pairDayDatas(where: { id_in: $pairIds }, orderBy: date, orderDirection: desc) {
      id
      date
      reserve0
      reserve1
      reserveUSD
    }
  }
`
export default pairDayDatasByIdsQuery
