import { polygonZkEvmTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Strategy, type VaultConfig } from '../../types'
import { MANAGER } from '../managers'

export const vaults: VaultConfig[] = [
  {
    id: 2,
    idByManager: 2,
    name: 'Bril',
    address: '0x200DcA6aaeE1BCBf5aA839c8D8E93a69688ffcF0',
    adapterAddress: '0x195C8d4439831a8B302F3Ceca15785216E94a62B',
    currencyA: polygonZkEvmTokens.matic,
    currencyB: polygonZkEvmTokens.grai,
    earningToken: polygonZkEvmTokens.matic,
    feeTier: FeeAmount.MEDIUM,
    strategy: Strategy.YIELD_IQ,
    manager: MANAGER.BRIL,
    isSingleDepositToken: true,
    allowDepositToken0: true,
    allowDepositToken1: false,
    managerInfoUrl: 'https://www.bril.finance/',
    strategyInfoUrl: 'https://docs.bril.finance/yield-iq/overview',
    learnMoreAboutUrl: 'https://docs.bril.finance/bril-finance/introduction',
  },
  {
    id: 1,
    idByManager: 1,
    name: 'Bril',
    address: '0x055a61Bf6fBD499aD718094eF4883F58C32628dd',
    adapterAddress: '0x4Af6c2937afA5e168584a3498bA8D05C5794b9Dc',
    currencyA: polygonZkEvmTokens.usdce,
    currencyB: polygonZkEvmTokens.grai,
    earningToken: polygonZkEvmTokens.matic,
    feeTier: FeeAmount.LOWEST,
    strategy: Strategy.YIELD_IQ,
    manager: MANAGER.BRIL,
    isSingleDepositToken: true,
    allowDepositToken0: true,
    allowDepositToken1: false,
    managerInfoUrl: 'https://www.bril.finance/',
    strategyInfoUrl: 'https://docs.bril.finance/yield-iq/overview',
    learnMoreAboutUrl: 'https://docs.bril.finance/bril-finance/introduction',
  },
]
