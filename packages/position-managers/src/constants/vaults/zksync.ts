import { zksyncTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Strategy, VaultConfig } from '../../types'
import { MANAGER } from '../managers'

export const vaults: VaultConfig[] = [
  {
    id: 1,
    idByManager: 1,
    name: 'DEFIEDGE',
    address: '0x43Da8432E9015C6660B927d842CD239df28Ffacf',
    adapterAddress: '0xa4a1306754c1Bf0d72BFCE38f408D5eaE3863c3B',
    currencyA: zksyncTokens.usdc,
    currencyB: zksyncTokens.weth,
    earningToken: zksyncTokens.cake,
    feeTier: FeeAmount.LOW,
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
