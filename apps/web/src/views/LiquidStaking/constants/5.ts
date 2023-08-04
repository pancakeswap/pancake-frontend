import { WETH9, NATIVE, ChainId } from '@pancakeswap/sdk'
import { LiquidStakingList, FunctionName } from 'views/LiquidStaking/constants/types'
import { WBETH } from 'config/constants/liquidStaking'
// ABI
import { wbethEthABI } from 'config/abi/wbethETH'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / WBETH',
    contract: WBETH[ChainId.GOERLI],
    symbol: WETH9[ChainId.GOERLI].symbol,
    token0: NATIVE[ChainId.GOERLI],
    token1: WETH9[ChainId.GOERLI],
    abi: wbethEthABI,
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    multiCallMethods: [
      {
        filterName: FunctionName.exchangeRate,
        abi: wbethEthABI,
        address: WBETH[ChainId.GOERLI],
        functionName: FunctionName.exchangeRate,
      },
    ],
  },
]

export default liquidStaking
