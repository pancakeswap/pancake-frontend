import { arbitrumTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Strategy, VaultConfig } from '../../types'
import { MANAGER } from '../managers'

export const vaults: VaultConfig[] = [
  {
    id: 1,
    idByManager: 1,
    name: 'DEFIEDGE',
    address: '0xa9B98C0cc70a7625aCB12B7dec5D278F317d4Cb0',
    adapterAddress: '0x58bd28D7C1fAD5BE7AFBA968d5E4C1a42f447ffE',
    currencyA: arbitrumTokens.weth,
    currencyB: arbitrumTokens.arb,
    earningToken: arbitrumTokens.cake,
    feeTier: FeeAmount.LOW,
    strategy: Strategy.ACTIVE,
    manager: MANAGER.DEFIEDGE,
    isSingleDepositToken: false,
    allowDepositToken0: true,
    allowDepositToken1: true,
    managerInfoUrl: 'https://www.defiedge.io/',
    strategyInfoUrl: 'https://docs.defiedge.io/category/strategy-manager',
    learnMoreAboutUrl: 'https://docs.defiedge.io/category/strategy-manager',
  },
]
