import { ChainId } from '@pancakeswap/chains'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import MPendleWarning from './mPendleWarning'

const { mPendle } = SwapWarningTokensConfig[ChainId.ARBITRUM_ONE]

const ARBITRUM_WARNING_LIST = {
  [mPendle.address]: {
    symbol: mPendle.symbol,
    component: <MPendleWarning />,
  },
}

export default ARBITRUM_WARNING_LIST
