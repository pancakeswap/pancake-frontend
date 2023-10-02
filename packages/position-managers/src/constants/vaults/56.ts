import { Percent } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

import { ManagerFeeType, Strategy, VaultConfig } from '../../types'
import { MANAGER } from '../managers'

export const vaults: VaultConfig[] = [
  {
    id: 1,
    address: '0x7fcBe3DDc2e6BD069eb5f11374DCA99f00685189',
    name: 'ICHI',
    currencyA: bscTokens.cake,
    currencyB: bscTokens.usdt,
    feeTier: FeeAmount.MEDIUM,
    strategy: Strategy.SUPER_ONE_SIDED,
    managerFee: {
      type: ManagerFeeType.LP_REWARDS,
      rate: new Percent(1, 100),
    },
    manager: MANAGER.ICHI,
    allowDepositToken0: true,
    allowDepositToken1: false,
  },
]
