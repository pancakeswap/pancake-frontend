import React, { useState } from 'react'

// export interface PastRoundErrorObject {
//   message: string
//   type: string
// }

export interface PastLotteryDataState {
  // pastRoundError: PastRoundErrorObject
  historyError: boolean
  historyData: Array<any>
}

export const PastLotteryDataContext = React.createContext({
  historyError: false,
  historyData: [],
} as PastLotteryDataState)
