import { gql } from 'graphql-request'

const pairIdByTokenIdsQuery = gql`
  query pairIdByTokenIdsQuery($token0Address: String, $token1Address: String) {
    pairs(where: { token0: $token0Address, token1: $token1Address }) {
      id
    }
  }
`
export default pairIdByTokenIdsQuery
