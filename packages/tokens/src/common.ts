import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import {bitgertTokens} from "./32520";
import {dogechainTokens} from "./2000";
import {dokenTokens} from "./61916";
import {fuseTokens} from "./122";
import {bscTokens} from "./56";


export const CAKE_MAINNET = bscTokens.cake

export const USDC_BSC = new ERC20Token(
  ChainId.BSC,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDT_BSC = bscTokens.usdt

export const BUSD_BSC = bscTokens.busd

export const USD: Record<ChainId, ERC20Token> = {
  [ChainId.BSC]: BUSD_BSC,
  [ChainId.BITGERT]: bitgertTokens.usdti,
  [ChainId.DOGE]: dogechainTokens.usdt,
  [ChainId.DOKEN]: dokenTokens.usdt,
  [ChainId.FUSE]: fuseTokens.usdt,
}


export const ICE = {
  [ChainId.BSC]: bscTokens.ice,
  [ChainId.BITGERT]: bitgertTokens.ice,
  [ChainId.DOGE]: dogechainTokens.ice,
  [ChainId.DOKEN]: dokenTokens.ice,
  [ChainId.FUSE]: fuseTokens.ice,
}

export const USDC = {
  [ChainId.BSC]: USDC_BSC,
}

export const USDT = {
  [ChainId.BSC]: USDT_BSC,
}
