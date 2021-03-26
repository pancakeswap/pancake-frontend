import { BetPosition } from 'state/types'

export interface PredictionUser {
  id: string
  address: string
  createdAt: string
  updatedAt: string
  block: string
  totalBets: string
  totalBNB: string
  bets: BetResponse[]
}

export interface BetResponse {
  id: string
  round: RoundResponse
  user: PredictionUser
  hash: string
  amount: string
  position: BetPosition
}

export interface RoundResponse {
  id: string
  epoch: string
  startedAt: string
  startBlock: string
  lockAt: string
  lockBlock: string
  lockPrice: string
  endAt: string
  endBlock: string
  closePrice: string
  totalBets: string
  totalAmount: string
  bullBets: string
  bearAmount: string
  bullAmount: string
  bets: BetResponse[]
}

type SortOrder = 'desc' | 'asc'

export const getRoundsQuery = (first = 5, orderBy = 'epoch', orderDirection: SortOrder = 'desc') => {
  return `
    rounds(first: ${first}, orderBy: ${orderBy}, orderDirection: ${orderDirection}) {
      id
      epoch
      startAt
      startBlock
      lockAt
      lockBlock
      lockPrice
      endAt
      endBlock
      closePrice
      totalBets
      totalAmount
      bullBets
      bullAmount
      bearBets
      bearAmount
      bets {
        hash
        amount
        position
      }
    }
  `
}

export const getRoundQuery = (id: string) => {
  return `
    round(id: "${id}") {
      id
      epoch
      startAt
      startBlock
      lockAt
      lockBlock
      lockPrice
      endAt
      endBlock
      closePrice
      totalBets
      totalAmount
      bullBets
      bullAmount
      bearBets
      bearAmount
      bets {
        hash
        amount
        position
      }
    }
  `
}
