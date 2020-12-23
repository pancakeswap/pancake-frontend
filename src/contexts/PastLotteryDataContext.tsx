import React, { useState } from 'react'

// export interface PastRoundErrorObject {
//   message: string
//   type: string
// }

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
