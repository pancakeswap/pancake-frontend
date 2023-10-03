import { ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, CAKE } from './common'

export const zkSyncTestnetTokens = {
  weth: WETH9[ChainId.ZKSYNC_TESTNET],
  usdc: USDC[ChainId.ZKSYNC_TESTNET],
  cake: CAKE[ChainId.ZKSYNC_TESTNET],
  mock: new ERC20Token(ChainId.ZKSYNC_TESTNET, '0x923AD8C9183A76B1DC341F23B8822AB4f7eBf9E0', 18, 'MOCK', 'MOCK'),
  mockC: new ERC20Token(ChainId.ZKSYNC_TESTNET, '0x6Ea0330F4342cc322F56b3f80D328fDFA5E83DD9', 18, 'MOCKC', 'MOCKC'),
  mockD: new ERC20Token(ChainId.ZKSYNC_TESTNET, '0x1067FF0B6827a2ee58Bc8A6Aa74d0EeDb147A93C', 18, 'MOCKD', 'MOCKD'),
}
