export interface UserResponse {
  id: string
  address: string
  block: string
  totalBets: string
  totalBNB: string
  bets?: BetResponse[]
}

export interface BetResponse {
  id: string
  hash: string
  amount: string
  position: string
  claimed: boolean
  user?: UserResponse
  round?: RoundResponse
}

export interface HistoricalBetResponse {
  id: string
  hash: string
  amount: string
  position: string
  claimed: boolean
  user?: UserResponse
  round: {
    id: string
    epoch: string
  }
}

export interface RoundResponse {
  id: string
  epoch: string
  startBlock: string
  lockAt: string
  lockBlock: string
  lockPrice: string
  endBlock: string
  closePrice: string
  totalBets: string
  totalAmount: string
  bearBets: string
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
        id
        hash  
        amount
        position
        claimed
        user {
          id
          address
          block
          totalBets
          totalBNB
        }
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
        id
        hash  
        amount
        position
        claimed
        user {
          id
          address
          block
          totalBets
          totalBNB
        }
      }
    }
  `
}

export const getUserPositionsQuery = (id: string) => {
  return `
    user(id: "${id.toLocaleLowerCase()}") {
      bets {
        id
        hash  
        amount
        position
        claimed
        round {
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
        }
        user {
          id
          address
          block
          totalBets
          totalBNB
        } 
      }
    }
  `
}
