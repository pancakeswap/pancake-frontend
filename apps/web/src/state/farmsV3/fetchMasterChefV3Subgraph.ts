import request, { gql } from 'graphql-request'
import _toLower from 'lodash/toLower'

const GRAPH_API_MASTERCHEF_V3 = 'https://api.thegraph.com/subgraphs/name/chef-jojo/masterchef-v3-chapel'

interface UserPositionResponse {
  id: string
}

export const getStakedPositionsByUser = async (user: string): Promise<UserPositionResponse[]> => {
  const response = await request(
    GRAPH_API_MASTERCHEF_V3,
    gql`
      query getStakedPositionsByUser($user: ID!) {
        userPositions(where: { user: $user, isStaked: true }) {
          id
        }
      }
    `,
    { user: _toLower(user) },
  )
  return response.userPositions
}
