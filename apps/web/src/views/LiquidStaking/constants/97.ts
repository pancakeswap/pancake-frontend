import { ChainId } from '@pancakeswap/chains'
import { WETH9 } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { WBETH } from 'config/constants/liquidStaking'
import { FunctionName, LiquidStakingList } from 'views/LiquidStaking/constants/types'
// FAQs
import { EthWbethFaq } from 'views/LiquidStaking/constants/FAQs/EthWbethFaq'
// ABI
import { wbethBscABI } from 'config/abi/wbethBSC'
import { Abi } from 'viem'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / wBETH',
    contract: WBETH[ChainId.BSC],
    token0: WETH9[ChainId.BSC_TESTNET],
    token1: bscTokens.wbeth,
    abi: wbethBscABI as Abi,
    shouldCheckApproval: true,
    approveToken: WETH9[ChainId.BSC_TESTNET],
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    exchangeRateMultiCall: [
      {
        abi: wbethBscABI as Abi,
        address: WBETH[ChainId.BSC_TESTNET],
        functionName: FunctionName.exchangeRate,
      },
    ],
    stakingMethodArgs: ['convertedStakeAmount', 'masterChefAddress'],
    stakingOverrides: [],
    FAQs: EthWbethFaq(),
    requestWithdrawFn: 'requestWithdrawEth',
  },
]

export default liquidStaking
