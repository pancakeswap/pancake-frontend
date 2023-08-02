import { NATIVE, WETH9, ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / WBETH',
    contract: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
    symbol: WETH9[ChainId.BSC].symbol,
    token0: WETH9[ChainId.BSC],
    token1: bscTokens.wbeth,
  },
  {
    stakingSymbol: 'BNB / SnBNB',
    contract: '0x1adB950d8bB3dA4bE104211D5AB038628e477fE6',
    symbol: NATIVE[ChainId.BSC].symbol,
    token0: NATIVE[ChainId.BSC],
    token1: bscTokens.snbnb,
  },
]

export default liquidStaking
