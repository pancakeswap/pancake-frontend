import { ChainId } from '@pancakeswap/chains'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import USDPlusWarning from './USDPlusWarning'

const { usdPlus } = SwapWarningTokensConfig[ChainId.ZKSYNC]

const ZKSYNC_WARNING_LIST = {
  [usdPlus.address]: {
    symbol: usdPlus.symbol,
    component: <USDPlusWarning />,
  },
}

export default ZKSYNC_WARNING_LIST
