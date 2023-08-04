import { WETH9, ChainId } from '@pancakeswap/sdk'
import { LiquidStakingList, FunctionName } from 'views/LiquidStaking/constants/types'
import { WBETH } from 'config/constants/liquidStaking'
// ABI
import { wbethBscABI } from 'config/abi/wbethBSC'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / WBETH',
    contract: WBETH[ChainId.BSC],
    symbol: WETH9[ChainId.BSC_TESTNET].symbol,
    token0: WETH9[ChainId.BSC_TESTNET],
    token1: WETH9[ChainId.BSC_TESTNET],
    abi: wbethBscABI,
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    multiCallMethods: [
      {
        filterName: FunctionName.exchangeRate,
        abi: wbethBscABI,
        address: WBETH[ChainId.BSC_TESTNET],
        functionName: FunctionName.exchangeRate,
      },
    ],
  },
]

export default liquidStaking
