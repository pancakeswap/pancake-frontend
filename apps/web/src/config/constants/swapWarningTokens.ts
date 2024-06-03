import { ChainId } from '@pancakeswap/chains'
import { Token } from '@pancakeswap/sdk'
import { bscTokens, ethereumTokens, zksyncTokens } from '@pancakeswap/tokens'
import { bscWarningTokens } from 'config/constants/warningTokens'

const { alETH } = ethereumTokens
const { bondly, itam, ccar, bttold, abnbc, metis } = bscTokens
const { pokemoney, free, safemoon, gala, xcad, lusd, nfp } = bscWarningTokens
const { usdPlus } = zksyncTokens
interface WarningTokenList {
  [chainId: number]: {
    [key: string]: Token
  }
}

const SwapWarningTokens = <WarningTokenList>{
  [ChainId.ETHEREUM]: {
    alETH,
  },
  [ChainId.BSC]: {
    safemoon,
    bondly,
    itam,
    ccar,
    bttold,
    pokemoney,
    free,
    gala,
    abnbc,
    xcad,
    metis,
    lusd,
    nfp,
  },
  [ChainId.ZKSYNC]: {
    usdPlus,
  },
}

export default SwapWarningTokens
