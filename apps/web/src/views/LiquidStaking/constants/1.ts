import { ChainId } from '@pancakeswap/chains'
import { NATIVE, WETH9 } from '@pancakeswap/sdk'
import { ethereumTokens } from '@pancakeswap/tokens'
import { WBETH } from 'config/constants/liquidStaking'
import { FunctionName, LiquidStakingList } from 'views/LiquidStaking/constants/types'
// FAQs
import { EthWbethFaq } from 'views/LiquidStaking/constants/FAQs/EthWbethFaq'
// ABI
import { wbethEthABI } from 'config/abi/wbethETH'
import { Abi } from 'viem'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / wBETH',
    contract: WBETH[ChainId.ETHEREUM],
    token0: NATIVE[ChainId.ETHEREUM],
    token1: ethereumTokens.wbeth,
    abi: wbethEthABI as Abi,
    shouldCheckApproval: true,
    approveToken: WETH9[ChainId.ETHEREUM],
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    exchangeRateMultiCall: [
      {
        abi: wbethEthABI as Abi,
        address: WBETH[ChainId.ETHEREUM],
        functionName: FunctionName.exchangeRate,
      },
    ],
    stakingMethodArgs: ['masterChefAddress'],
    stakingOverrides: ['value'],
    FAQs: EthWbethFaq(),
    requestWithdrawFn: 'requestWithdrawEth',
  },
]

export default liquidStaking
