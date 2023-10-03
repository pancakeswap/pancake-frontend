import { ChainId } from '@pancakeswap/chains'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import ALETHWarning from './ALETHWarning'

const { alETH } = SwapWarningTokensConfig[ChainId.ETHEREUM]

const ETH_WARNING_LIST = {
  [alETH.address]: {
    symbol: alETH.symbol,
    component: <ALETHWarning />,
  },
}

export default ETH_WARNING_LIST
