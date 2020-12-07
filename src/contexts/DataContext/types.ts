import BigNumber from 'bignumber.js'
import { Farm } from 'sushi/lib/constants/types'

export interface FarmLP extends Farm {
  tokenDecimals?: number | string
  tokenAmount?: BigNumber
  wbnbAmount?: BigNumber
  totalWbnbValue?: BigNumber
  tokenPrice?: BigNumber
  poolWeight?: BigNumber
}

export interface State {
  farms: FarmLP[]
}
