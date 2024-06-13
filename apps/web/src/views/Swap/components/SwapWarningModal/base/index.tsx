import { ChainId } from '@pancakeswap/chains'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import { AthWarning } from './AthWarning'

const { alt } = SwapWarningTokensConfig[ChainId.BASE]

const BASE_WARNING_LIST = {
  [alt.address]: {
    symbol: alt.symbol,
    component: <AthWarning />,
  },
}

export default BASE_WARNING_LIST
