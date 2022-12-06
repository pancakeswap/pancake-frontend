import { ChainId, ERC20Token, WBNB } from '@pancakeswap/sdk'
import { BUSD_TESTNET, CAKE_TESTNET } from './common'

export const bscTestnetTokens = {
  wbnb: WBNB[ChainId.BSC_TESTNET],
  cake: CAKE_TESTNET,
  busd: BUSD_TESTNET,
  syrup: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
    18,
    'SYRUP',
    'SyrupBar Token',
    'https://pancakeswap.finance/',
  ),
  bake: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    18,
    'BAKE',
    'Bakeryswap Token',
    'https://www.bakeryswap.org/',
  ),
  hbtc: new ERC20Token(ChainId.BSC_TESTNET, '0x3Fb6a6C06c7486BD194BB99a078B89B9ECaF4c82', 18, 'HBTC', 'Huobi BTC'),
  wbtc: new ERC20Token(ChainId.BSC_TESTNET, '0xfC8bFbe9644e1BC836b8821660593e7de711e564', 8, 'WBTC', 'Wrapped BTC'),
  usdc: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xCA8eB2dec4Fe3a5abbFDc017dE48E461A936623D',
    18,
    'USDC',
    'Binance-Peg USD Coin',
  ),
  usdt: new ERC20Token(ChainId.BSC_TESTNET, '0x0fB5D7c73FA349A90392f873a4FA1eCf6a3d0a96', 18, 'USDT', 'Tether USD'),
  mockBusd: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0x3304dd20f6Fe094Cb0134a6c8ae07EcE26c7b6A7',
    18,
    'BUSD',
    'Binance USD',
  ),
}
