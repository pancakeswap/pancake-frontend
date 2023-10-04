import { Percent } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

import { ManagerFeeType, Strategy, VaultConfig } from '../../types'
import { MANAGER } from '../managers'

export const vaults: VaultConfig[] = [
  {
    id: 1,
    name: 'ICHI',
    lpAddress: '0x63652e66Abd23d02537759f03314c333921915E1',
    address: '0x7fcBe3DDc2e6BD069eb5f11374DCA99f00685189',
    currencyA: bscTokens.cake,
    currencyB: bscTokens.usdt,
    earningToken: bscTokens.cake,
    feeTier: FeeAmount.MEDIUM,
    strategy: Strategy.YIELD_IQ,
    managerFee: {
      type: ManagerFeeType.LP_REWARDS,
      rate: new Percent(1, 100),
    },
    manager: MANAGER.ICHI,
    isSingleToken: true,
    allowDepositToken0: true,
    allowDepositToken1: false,
    priceFromV3FarmPid: 3,
    managerInfoUrl: 'https://google.com/',
    strategyInfoUrl: 'https://google.com/',
  },
]
