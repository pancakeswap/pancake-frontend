import { NATIVE, WETH9, ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { LiquidStakingList, FunctionName } from 'views/LiquidStaking/constants/types'
import { WBETH, SNBNB } from 'config/constants/liquidStaking'
// ABI
import { wbethBscABI } from 'config/abi/wbethBSC'
import { snBnbABI } from 'config/abi/snBNB'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / WBETH',
    contract: WBETH[ChainId.BSC],
    symbol: WETH9[ChainId.BSC].symbol,
    token0: WETH9[ChainId.BSC],
    token1: bscTokens.wbeth,
    abi: wbethBscABI,
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    multiCallMethods: [
      {
        filterName: FunctionName.exchangeRate,
        abi: wbethBscABI,
        address: WBETH[ChainId.BSC],
        functionName: FunctionName.exchangeRate,
      },
    ],
  },
  {
    stakingSymbol: 'BNB / SnBNB',
    contract: SNBNB[ChainId.BSC],
    symbol: NATIVE[ChainId.BSC].symbol,
    token0: NATIVE[ChainId.BSC],
    token1: bscTokens.snbnb,
    abi: snBnbABI,
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    multiCallMethods: [
      {
        filterName: FunctionName.exchangeRate,
        abi: snBnbABI,
        address: SNBNB[ChainId.BSC],
        functionName: FunctionName.convertSnBnbToBnb,
        args: [1000000000000000000], // 1 SnBNB
      },
    ],
  },
]

export default liquidStaking
