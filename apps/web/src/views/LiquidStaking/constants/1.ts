import { WETH9, NATIVE, ChainId } from '@pancakeswap/sdk'
import { LiquidStakingList, FunctionName } from 'views/LiquidStaking/constants/types'
import { WBETH } from 'config/constants/liquidStaking'
// ABI
import { wbethEthABI } from 'config/abi/wbethETH'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / WBETH',
    contract: WBETH[ChainId.ETHEREUM],
    symbol: WETH9[ChainId.ETHEREUM].symbol,
    token0: NATIVE[ChainId.ETHEREUM],
    token1: WETH9[ChainId.ETHEREUM],
    abi: wbethEthABI,
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    multiCallMethods: [
      {
        filterName: FunctionName.exchangeRate,
        abi: wbethEthABI,
        address: WBETH[ChainId.ETHEREUM],
        functionName: FunctionName.exchangeRate,
      },
    ],
  },
]

export default liquidStaking
