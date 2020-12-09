import BigNumber from 'bignumber.js'
import { Farm } from 'sushi/lib/constants/types'

export interface FarmLP extends Farm {
  tokenAmount?: BigNumber
  quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
}

export interface State {
  farms: FarmLP[]
}
