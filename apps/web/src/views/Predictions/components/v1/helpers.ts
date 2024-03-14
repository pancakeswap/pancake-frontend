import { GRAPH_API_PREDICTION_V1 } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import flatten from 'lodash/flatten'

export const getV1History = async (skip = 0, where = {}): Promise<Record<string, any>[]> => {
  const response = await request(
    GRAPH_API_PREDICTION_V1,
    gql`
      query getV1BetHistory($skip: Int!, $where: Bet_filter) {
        bets(first: 1000, skip: $skip, where: $where, orderBy: createdAt, orderDirection: desc) {
          hash
          amount
          position
          claimed
          claimedAmount
          claimedHash
          round {
            epoch
            bullAmount
            bearAmount
            position
            failed
            totalAmount
            lockPrice
            closePrice
            totalBets
            totalAmount
          }
        }
      }
    `,
    { skip, where },
  )
  return response.bets
}

export type V1History = Record<string, any>
export const getAllV1History = (where = {}): Promise<V1History[]> => {
  return new Promise((resolve, reject) => {
    const bets = {}

    const getHistoryChunk = async (skip: number) => {
      try {
        const betHistory = await getV1History(skip, where)
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
