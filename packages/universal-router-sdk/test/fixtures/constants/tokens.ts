import { ERC20Token, Ether } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { CAKE as _CAKE, USDT as _USDT, USDC as _USDC } from '@pancakeswap/tokens/src/common'
import { zeroAddress } from 'viem'

export { WETH9 } from '@pancakeswap/sdk'

export const ETHER = {
  on(chainId: ChainId): Ether {
    return Ether.onChain(chainId)
  },
}

export const CAKE = {
  ..._CAKE,

  // @notice: temporary ignore missed testnet address
  [ChainId.OPBNB_TESTNET]: new ERC20Token(ChainId.OPBNB_TESTNET, zeroAddress, 0, 'CAKE'),
  [ChainId.SCROLL_SEPOLIA]: new ERC20Token(ChainId.SCROLL_SEPOLIA, zeroAddress, 0, 'CAKE'),
}

export const USDT = {
  ..._USDT,
  [ChainId.BSC_TESTNET]: new ERC20Token(ChainId.BSC_TESTNET, '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', 6, 'USDT'),
  // @notice: use USDC in goerli instead of
  [ChainId.GOERLI]: new ERC20Token(ChainId.GOERLI, zeroAddress, 6, 'USDT'),

  // @notice: temporary ignore missed testnet address
  [ChainId.ZKSYNC_TESTNET]: new ERC20Token(ChainId.ZKSYNC_TESTNET, zeroAddress, 6, 'USDT'),
  [ChainId.ARBITRUM_GOERLI]: new ERC20Token(ChainId.ARBITRUM_GOERLI, zeroAddress, 6, 'USDT'),
  [ChainId.SCROLL_SEPOLIA]: new ERC20Token(ChainId.SCROLL_SEPOLIA, zeroAddress, 6, 'USDT'),
  [ChainId.LINEA_TESTNET]: new ERC20Token(ChainId.LINEA_TESTNET, zeroAddress, 6, 'USDT'),
  [ChainId.BASE]: new ERC20Token(ChainId.BASE, zeroAddress, 6, 'USDT'),
  [ChainId.BASE_TESTNET]: new ERC20Token(ChainId.BASE_TESTNET, zeroAddress, 6, 'USDT'),
}
export const USDC = {
  ..._USDC,
  // @notice: temporary ignore missed testnet address
  [ChainId.POLYGON_ZKEVM_TESTNET]: new ERC20Token(ChainId.POLYGON_ZKEVM_TESTNET, zeroAddress, 6, '_USDC'),
}
