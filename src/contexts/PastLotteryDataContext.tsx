import React from 'react'

export interface PastLotteryDataState {
  mostRecentLotteryNumber: number
  historyError: boolean
  historyData: Array<any>
}

export default React.createContext({
  mostRecentLotteryNumber: 0,
  historyError: false,
  historyData: [],
} as PastLotteryDataState)
