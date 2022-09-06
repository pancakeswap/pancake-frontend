import { Token } from '@pancakeswap/sdk'
import { bscTestnetTokens } from '@pancakeswap/tokens'
import { ChainId } from '../../../packages/swap-sdk/src/constants'

export const infoStableSwapAddress = '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546'

const stableSwapConfigs = [
  {
    stableSwapAddress: '0x270c8828e56C266CA1B100968B768Bd191C15747',
    liquidityToken: new Token(
      ChainId.BSC_TESTNET,
      '0xc50eF16D5CCe3648057c5bF604025dCD633bd795',
      18,
      'Stable-LP',
      'Pancake StableSwap LPs',
    ),
    token0: bscTestnetTokens.hbtc,
    token1: bscTestnetTokens.wbtc,
  },
]

export default stableSwapConfigs
