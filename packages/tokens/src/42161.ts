import { ERC20Token, WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDT, USDC, CAKE } from './common'

export const arbitrumTokens = {
  weth: WETH9[ChainId.ARBITRUM_ONE],
  usdt: USDT[ChainId.ARBITRUM_ONE],
  usdc: USDC[ChainId.ARBITRUM_ONE],
  cake: CAKE[ChainId.ARBITRUM_ONE],
  arb: new ERC20Token(ChainId.ARBITRUM_ONE, '0x912CE59144191C1204E64559FE8253a0e49E6548', 18, 'ARB', 'Arbitrum'),
  gmx: new ERC20Token(ChainId.ARBITRUM_ONE, '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a', 18, 'GMX', 'GMX'),
  wbtc: new ERC20Token(ChainId.ARBITRUM_ONE, '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', 8, 'WBTC', 'Wrapped BTC'),
  alp: new ERC20Token(ChainId.ARBITRUM_ONE, '0xBc76B3FD0D18C7496C0B04aeA0Fe7C3Ed0e4d9C9', 18, 'ALP', 'ApolloX LP'),
  lvl: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xB64E280e9D1B5DbEc4AcceDb2257A87b400DB149',
    18,
    'LVL',
    'Level Token',
    'https://level.finance/',
  ),
  mgp: new ERC20Token(ChainId.ARBITRUM_ONE, '0xa61F74247455A40b01b0559ff6274441FAfa22A3', 18, 'MGP', 'Magpie Token'),
}
