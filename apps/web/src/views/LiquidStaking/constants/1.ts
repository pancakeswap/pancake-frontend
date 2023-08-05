import { WETH9, NATIVE, ChainId } from '@pancakeswap/sdk'
import { ethereumTokens } from '@pancakeswap/tokens'
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
    token1: ethereumTokens.wbeth,
    abi: wbethEthABI,
    shouldCheckApproval: true,
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    exchangeRateMultiCall: [
      {
        abi: wbethEthABI,
        address: WBETH[ChainId.ETHEREUM],
        functionName: FunctionName.exchangeRate,
      },
    ],
  },
]

export default liquidStaking
