import { WETH9, NATIVE, ChainId } from '@pancakeswap/sdk'
import { ethereumTokens } from '@pancakeswap/tokens'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / WBETH',
    contract: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
    symbol: WETH9[ChainId.GOERLI].symbol,
    token0: NATIVE[ChainId.GOERLI],
    token1: ethereumTokens.wbeth,
  },
]

export default liquidStaking
