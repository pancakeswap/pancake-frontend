import { WETH9, ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / WBETH',
    contract: '0x34f8f72e3f14Ede08bbdA1A19a90B35a80f3E789',
    symbol: WETH9[ChainId.BSC_TESTNET].symbol,
    token0: WETH9[ChainId.BSC_TESTNET],
    token1: bscTokens.wbeth,
  },
]

export default liquidStaking
