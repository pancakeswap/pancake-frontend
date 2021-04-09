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
  position: string
  bets: BetResponse[]
}

const getRoundBaseFields = () => `
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
  position
`

const getBetBaseFields = () => `
  id
  hash  
  amount
  position
  claimed
`

const getUserBaseFields = () => `
  id
  address
  block
  totalBets
  totalBNB
`

type SortOrder = 'desc' | 'asc'

export const getRoundsQuery = (first = 5, orderBy = 'epoch', orderDirection: SortOrder = 'desc') => {
  return `
    rounds(first: ${first}, orderBy: ${orderBy}, orderDirection: ${orderDirection}) {
      ${getRoundBaseFields()}
      bets {
        ${getBetBaseFields()}
        user {
          ${getUserBaseFields()}
        }
      }
    }
  `
}

export const getRoundQuery = (id: string) => {
  return `
    round(id: "${id}") {
      ${getRoundBaseFields()}
      bets {
       ${getBetBaseFields()}
        user {
         ${getUserBaseFields()}
        }
      }
    }
  `
}

export type BetHistoryWhereClause = {
  user?: string
  round?: string
  claimed?: boolean
}

export const getBetHistoryQuery = (whereClause: BetHistoryWhereClause = {}, first: number, skip: number) => {
  // Note: The graphql API won't accept JSON.stringify because of the quotes
  const whereClauseArr = Object.keys(whereClause).reduce((accum, key) => {
    const value = whereClause[key]

    if (value === undefined) {
      return accum
    }

    return [...accum, `${key}: ${typeof value === 'boolean' ? value : `"${value.toLowerCase()}"`}`]
  }, [])

  return `
    bets(first: ${first}, skip: ${skip}, where: {${whereClauseArr.join(',')}}) {
      ${getBetBaseFields()}
      round {
        ${getRoundBaseFields()}
      }
      user {
        ${getUserBaseFields()}
      } 
    }
  `
}

export const getBetQuery = (id: string) => {
  return `
    bet(id: "${id.toLocaleLowerCase()}") {
      ${getBetBaseFields()}
      round {
        ${getRoundBaseFields()}
      }
      user {
        ${getUserBaseFields()}
      } 
    }
  `
}
