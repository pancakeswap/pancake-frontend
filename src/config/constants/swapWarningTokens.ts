import { Token } from '@pancakeswap/sdk'
import tokens from 'config/constants/tokens'
import warningTokens from 'config/constants/warningTokens'

const { bondly, safemoon, itam, ccar, bttold } = tokens
const { pokemoney, free } = warningTokens

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{
  safemoon,
  bondly,
  itam,
  ccar,
  bttold,
  pokemoney,
  free,
}

export default SwapWarningTokens
