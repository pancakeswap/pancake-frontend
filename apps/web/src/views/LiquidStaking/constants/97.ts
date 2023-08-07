import { WETH9, ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { LiquidStakingList, FunctionName } from 'views/LiquidStaking/constants/types'
import { WBETH } from 'config/constants/liquidStaking'
// ABI
import { wbethBscABI } from 'config/abi/wbethBSC'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / WBETH',
    contract: WBETH[ChainId.BSC],
    token0: WETH9[ChainId.BSC_TESTNET],
    token1: bscTokens.wbeth,
    abi: wbethBscABI,
    shouldCheckApproval: true,
    approveToken: WETH9[ChainId.BSC_TESTNET],
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    exchangeRateMultiCall: [
      {
        abi: wbethBscABI,
        address: WBETH[ChainId.BSC_TESTNET],
        functionName: FunctionName.exchangeRate,
      },
    ],
  },
]

export default liquidStaking
