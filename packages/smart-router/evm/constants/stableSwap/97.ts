import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import { bscTestnetTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from './types'

export const pools: StableSwapPool[] = [
  // {
  //   lpSymbol: 'USDC-BUSD LP',
  //   lpAddress: '0xd1742b5eC6798cEB8C791e0ebbEf606A4946f67E',
  //   token: bscTestnetTokens.usdc, // coins[0]
  //   quoteToken: bscTestnetTokens.busd, // coins[1]
  //   stableSwapAddress: '0x1288026D2c5a76A5bfb0730F615131A448f4Ad06',
  //   infoStableSwapAddress: '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546',
  // },
  {
    lpSymbol: 'USDT-WBNB LP',
    lpAddress: '0x4c091Dc4418Bd3353A87488535528FD86954da2c',
    token: new ERC20Token(ChainId.BSC_TESTNET, '0x0fB5D7c73FA349A90392f873a4FA1eCf6a3d0a96', 18, 'USDT', 'MOCK Token'), // coins[0]
    quoteToken: bscTestnetTokens.wbnb, // coins[1]
    stableSwapAddress: '0xBcd585Ee8B8Ac8de6b0e45dA32Aa31703036b2a1',
    infoStableSwapAddress: '0x0A548d59D04096Bc01206D58C3D63c478e1e06dB',
    stableLpFee: 0.0004,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
