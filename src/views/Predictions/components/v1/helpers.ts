import request, { gql } from 'graphql-request'
import flatten from 'lodash/flatten'
import { GRAPH_API_PREDICTION_V1 } from 'config/constants/endpoints'

export const getV1History = async (account: string, skip = 0): Promise<Record<string, any>[]> => {
  const response = await request(
    GRAPH_API_PREDICTION_V1,
    gql`
      query getV1BetHistory($skip: Int!, $where: Bet_filter) {
        bets(first: 1000, skip: $skip, where: $where) {
          amount
          position
          round {
            epoch
            position
            failed
            totalAmount
          }
        }
      }
    `,
    { skip, where: { user: account.toLowerCase(), claimed: false } },
  )
  return response.bets
}

export const getAllV1History = (account: string): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const bets = {}

    const getHistoryChunk = async (skip: number) => {
      try {
        const betHistory = await getV1History(account, skip)
        bets[skip] = betHistory

        if (betHistory.length === 0) {
          resolve(flatten(Object.values(bets)))
        } else {
          getHistoryChunk(skip + 1000)
        }
      } catch (error) {
        reject(error)
      }
    }

    getHistoryChunk(0)
  })
}
