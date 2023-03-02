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
    stableLpFee: 0,
    stableLpFeeRateOfTotalFee: 0,
  },
  {
    lpSymbol: 'WBNB-USDT LP',
    lpAddress: '0x13Ea1BA0DE82aad338D0f7CE3F4eE505280f1B92',
    token: bscTestnetTokens.usdt, // coins[0]
    quoteToken: bscTestnetTokens.wbnb, // coins[1]
    stableSwapAddress: '0xD38F21E8C575F85Ef3dFeeCfb177666aA62DEcd2',
    infoStableSwapAddress: '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546',
    stableLpFee: 0.0004,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
