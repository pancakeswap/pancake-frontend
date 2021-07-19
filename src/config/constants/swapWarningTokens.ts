import tokens from 'config/constants/tokens'
import { Address } from './types'

const { bondly } = tokens

interface WarningToken {
  symbol: string
  address: Address
}

interface WarningTokenList {
  [key: string]: WarningToken
}

const SwapWarningTokens = <WarningTokenList>{
  safemoon: {
    symbol: 'SAFEMOON',
    address: {
      56: '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3',
      97: '',
    },
  },
  bondly,
}

export default SwapWarningTokens
