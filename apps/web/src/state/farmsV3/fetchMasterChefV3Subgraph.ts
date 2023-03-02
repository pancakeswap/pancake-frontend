import request, { gql } from 'graphql-request'
import _toLower from 'lodash/toLower'

const GRAPH_API_MASTERCHEF_V3 = 'https://api.thegraph.com/subgraphs/name/chef-jojo/masterchef-v3-chapel'

interface UserPositionResponse {
  id: string
  pool: {
    id: string
  }
}

export const getStakedPositionsByUser = async (user: string, pids: number[]): Promise<UserPositionResponse[]> => {
  const response = await request(
    GRAPH_API_MASTERCHEF_V3,
    gql`
      query getStakedPositionsByUser($user: ID!, $poolPids: [String!]) {
        userPositions(where: { pool_in: $poolPids, user: $user, isStaked: true }) {
          id
          pool {
            id
          }
        }
      }
    `,
    { user: _toLower(user), poolPids: pids.map((id) => id.toString()) },
  )

  return response.userPositions
}
