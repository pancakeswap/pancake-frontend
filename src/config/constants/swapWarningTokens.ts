import { Token } from '@pancakeswap/sdk'
import tokens from 'config/constants/tokens'

const { bondly, safemoon, itam } = tokens

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{
  safemoon,
  bondly,
  itam,
}

export default SwapWarningTokens
