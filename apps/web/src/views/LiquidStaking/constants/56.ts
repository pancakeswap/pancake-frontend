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
    token0: WETH9[ChainId.BSC],
    token1: bscTokens.wbeth,
    abi: wbethBscABI,
    shouldCheckApproval: true,
    approveToken: WETH9[ChainId.BSC],
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    exchangeRateMultiCall: [
      {
        abi: wbethBscABI,
        address: WBETH[ChainId.BSC],
        functionName: FunctionName.exchangeRate,
      },
    ],
  },
  {
    stakingSymbol: 'BNB / SnBNB',
    contract: SNBNB[ChainId.BSC],
    token0: NATIVE[ChainId.BSC],
    token1: bscTokens.snbnb,
    abi: snBnbABI,
    shouldCheckApproval: false,
    approveToken: null,
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    exchangeRateMultiCall: [
      {
        abi: snBnbABI,
        address: SNBNB[ChainId.BSC],
        functionName: FunctionName.convertSnBnbToBnb,
        args: [1000000000000000000], // 1 SnBNB
      },
    ],
  },
]

export default liquidStaking
