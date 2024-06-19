import { ChainId } from '@pancakeswap/chains'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import { AthWarning } from './AthWarning'

const { ath } = SwapWarningTokensConfig[ChainId.BASE]

const BASE_WARNING_LIST = {
  [ath.address]: {
    symbol: ath.symbol,
    component: <AthWarning />,
  },
}

export default BASE_WARNING_LIST
