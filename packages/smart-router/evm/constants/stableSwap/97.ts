import { ChainId, ERC20Token, Native } from '@pancakeswap/sdk'
import { bscTestnetTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from '../../types/pool'

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'USDC-BUSD LP',
    lpAddress: '0xd1742b5eC6798cEB8C791e0ebbEf606A4946f67E',
    token: bscTestnetTokens.usdc, // coins[0]
    quoteToken: bscTestnetTokens.busd, // coins[1]
    stableSwapAddress: '0x1288026D2c5a76A5bfb0730F615131A448f4Ad06',
    infoStableSwapAddress: '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546',
  },
  {
    lpSymbol: 'WBNB-BNB LP',
    lpAddress: '0x25a2a8F1fA6A0A83a22F0DD19e3400a14d096Cd5',
    token: new ERC20Token(ChainId.BSC_TESTNET, '0x6db1c08e3cBA84Fd1676CFb2837aefEfB61f9E67', 18, 'TestBNB'), // coins[0]
    quoteToken: Native.onChain(ChainId.BSC_TESTNET),
    stableSwapAddress: '0xEB3734ed445A3cC1504a00895EfA20004c1f0f6c',
    infoStableSwapAddress: '0x0A548d59D04096Bc01206D58C3D63c478e1e06dB',
  },
]
