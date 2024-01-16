import { ERC20Token, WBNB } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'

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
  mockB: new ERC20Token(ChainId.BSC_TESTNET, '0x828E3FC56dD48E072e3B6F3C4FD4DDB4733c2C5e', 18, 'MOCK B', 'MOCK B'),
  mockA: new ERC20Token(ChainId.BSC_TESTNET, '0xc1eD9955C11585F47d0d6BfBC29034349A746a81', 18, 'MOCK A', 'MOCK A'),
  msix: new ERC20Token(ChainId.BSC_TESTNET, '0xE4a9f36B61a84Dc2495dAf46417bd258a56bDfdD', 6, 'MSIX', 'MSIX'),
  cake2: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0x8d008B313C1d6C7fE2982F62d32Da7507cF43551',
    18,
    'CAKE2',
    'PancakeSwap Token',
    'https://pancakeswap.finance/',
  ),
}
