import { Token } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { bscWarningTokens } from 'config/constants/warningTokens'

const { bondly, itam, ccar, bttold, hay, abnbc } = bscTokens
const { pokemoney, free, safemoon, gala } = bscWarningTokens

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
  gala,
  hay,
  abnbc,
}

export default SwapWarningTokens
