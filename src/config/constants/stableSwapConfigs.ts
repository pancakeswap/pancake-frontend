import { bscTestnetTokens } from '@pancakeswap/tokens'

export const infoStableSwapAddress = '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546'

const stableSwapConfigs = [
  {
    stableSwapAddress: '0x1288026D2c5a76A5bfb0730F615131A448f4Ad06',
    lpAddress: '0xd1742b5eC6798cEB8C791e0ebbEf606A4946f67E',
    token0: bscTestnetTokens.busd,
    token1: bscTestnetTokens.usdc,
  },
  {
    stableSwapAddress: '0x270c8828e56C266CA1B100968B768Bd191C15747',
    lpAddress: '0xc50eF16D5CCe3648057c5bF604025dCD633bd795',
    token0: bscTestnetTokens.hbtc,
    token1: bscTestnetTokens.wbtc,
  },
]

export default stableSwapConfigs
