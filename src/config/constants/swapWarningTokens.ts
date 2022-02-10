import { Token } from '@pancakeswap/sdk'
import tokens from 'config/constants/tokens'

const { bondly, safemoon, itam, ccar, btt } = tokens

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{
  safemoon,
  bondly,
  itam,
  ccar,
  btt,
}

export default SwapWarningTokens
