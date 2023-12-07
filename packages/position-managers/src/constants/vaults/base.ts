import { baseTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Strategy, VaultConfig } from '../../types'
import { MANAGER } from '../managers'

export const vaults: VaultConfig[] = [
  {
    id: 1,
    idByManager: 1,
    name: 'DEFIEDGE',
    address: '0xdf431D25e3BE16bDf7501F70e7fBa55a9E53eae5',
    adapterAddress: '0xFB90a3F1822fa3Da84C984272a6266Cf336A1807',
    currencyA: baseTokens.usdc,
    currencyB: baseTokens.usdbc,
    earningToken: baseTokens.cake,
    feeTier: FeeAmount.LOWEST,
    strategy: Strategy.ALO,
    manager: MANAGER.DEFIEDGE,
    isSingleDepositToken: false,
    allowDepositToken0: true,
    allowDepositToken1: true,
    managerInfoUrl: 'https://www.defiedge.io/',
    strategyInfoUrl: 'https://docs.defiedge.io/category/strategy-manager',
    learnMoreAboutUrl: 'https://docs.defiedge.io/category/strategy-manager',
  },
]
