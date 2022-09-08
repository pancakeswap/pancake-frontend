import { Token } from '@pancakeswap/sdk'
import { bscTestnetTokens } from '@pancakeswap/tokens'
import { ChainId } from '../../../packages/swap-sdk/src/constants'

export const infoStableSwapAddress = '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546'

const stableSwapConfigs = [
  {
    stableSwapAddress: '0x1288026D2c5a76A5bfb0730F615131A448f4Ad06',
    liquidityToken: new Token(
      ChainId.BSC_TESTNET,
      '0xd1742b5eC6798cEB8C791e0ebbEf606A4946f67E',
      18,
      'Stable-LP',
      'Pancake StableSwap LPs',
    ),
    token0: bscTestnetTokens.usdc,
    token1: bscTestnetTokens.busd,
  },
]

export default stableSwapConfigs
