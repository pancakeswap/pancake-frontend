import tokens from './tokens'
import { FarmConfig } from './types'

const priceHelperLps: FarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs.
   */
  {
    pid: null,
    lpSymbol: 'QSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7b3ae32eE8C532016f3E31C8941D937c59e055B9',
    },
    token: tokens.qsd,
    quoteToken: tokens.wbnb,
  },
]

export default priceHelperLps
