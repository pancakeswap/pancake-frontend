import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import {bitgertTokens} from "./32520";
import {dogechainTokens} from "./2000";
import {dokenTokens} from "./61916";
import {fuseTokens} from "./122";


export const USD: Record<ChainId, ERC20Token> = {
  [ChainId.BITGERT]: bitgertTokens.usdti,
  [ChainId.DOGE]: dogechainTokens.usdt,
  [ChainId.DOKEN]: dokenTokens.usdt,
  [ChainId.FUSE]: fuseTokens.usdt,
}

export const ICE = {
  [ChainId.BITGERT]: bitgertTokens.ice,
  [ChainId.DOGE]: dogechainTokens.ice,
  [ChainId.DOKEN]: dokenTokens.ice,
  [ChainId.FUSE]: fuseTokens.ice,
}