import { Token } from '@pancakeswap/sdk'
import { bscTokens } from 'config/constants/tokens'
import { mainnetWarningTokens } from 'config/constants/warningTokens'

const { bondly, itam, ccar, bttold } = bscTokens
const { pokemoney, free, safemoon } = mainnetWarningTokens

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
