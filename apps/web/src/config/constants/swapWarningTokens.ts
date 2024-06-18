import { ChainId } from '@pancakeswap/chains'
import { Token } from '@pancakeswap/sdk'
import { bscTokens, ethereumTokens, zksyncTokens } from '@pancakeswap/tokens'
import { baseWarningTokens } from 'config/constants/warningTokens/baseWarningTokens'
import { bscWarningTokens } from 'config/constants/warningTokens/bscWarningTokens'

const { alETH } = ethereumTokens
const { bondly, itam, ccar, bttold, abnbc, metis } = bscTokens
const { pokemoney, free, safemoon, gala, xcad, lusd, nfp } = bscWarningTokens
const { usdPlus } = zksyncTokens
const { ath } = baseWarningTokens

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
  [ChainId.BASE]: {
    ath,
  },
}

export default SwapWarningTokens
