import { Native, ChainId, Percent } from '@pancakeswap/sdk'
import { ethereumTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

import { ManagerFeeType, Strategy, VaultConfig } from '../../types'
import { MANAGER } from '../managers'

export const vaults: VaultConfig[] = [
  {
    id: 1,
    address: '0x',
    name: 'PCS',
    currencyA: ethereumTokens.cake,
    currencyB: Native.onChain(ChainId.ETHEREUM),
    feeTier: FeeAmount.MEDIUM,
    strategy: Strategy.TYPICAL_WIDE,
    managerFee: {
      type: ManagerFeeType.LP_REWARDS,
      rate: new Percent(1, 100),
    },
    manager: MANAGER.PCS,
  },
  {
    id: 2,
    address: '0x',
    name: 'PCS',
    currencyA: ethereumTokens.cake,
    currencyB: Native.onChain(ChainId.ETHEREUM),
    feeTier: FeeAmount.LOW,
    strategy: Strategy.TYPICAL_WIDE,
    managerFee: {
      type: ManagerFeeType.LP_REWARDS,
      rate: new Percent(1, 100),
    },
    autoCompound: true,
    autoFarm: true,
    manager: MANAGER.PCS,
  },
]
