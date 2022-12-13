import { ChainId, ERC20Token, WIDE } from '@pancakeswap/sdk'
import { BUSD_TESTNET, CAKE_TESTNET } from './common'

export const bscTestnetTokens = {
  wide: WIDE[ChainId.BSC_TESTNET],
  cake: CAKE_TESTNET,
  busd: BUSD_TESTNET,
  // syrup: new ERC20Token(
  //   ChainId.BSC_TESTNET,
  //   '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
  //   18,
  //   'SYRUP',
  //   'SyrupBar Token',
  //   'https://pancakeswap.finance/',
  // ),
  // bake: new ERC20Token(
  //   ChainId.BSC_TESTNET,
  //   '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
  //   18,
  //   'BAKE',
  //   'Bakeryswap Token',
  //   'https://www.bakeryswap.org/',
  // ),
  // hbtc: new ERC20Token(ChainId.BSC_TESTNET, '0x3Fb6a6C06c7486BD194BB99a078B89B9ECaF4c82', 18, 'HBTC', 'Huobi BTC'),
  // wbtc: new ERC20Token(ChainId.BSC_TESTNET, '0xfC8bFbe9644e1BC836b8821660593e7de711e564', 8, 'WBTC', 'Wrapped BTC'),
  usdc: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0x407d6E2bF44A1B70eBd51CcF0aFCFBbD5F0b6d15',
    18,
    'USDC',
    'USDC',
  ),
  usdt: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xDEd24358C0d7C96BC419F479771D1da3443Fe52d',
    18,
    'USDT',
    'USDT',
  ),
}
