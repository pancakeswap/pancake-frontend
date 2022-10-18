/* eslint-disable camelcase */
import { Currency, CurrencyAmount } from '@pancakeswap/aptos-swap-sdk'
import { VaultKey } from '../types'

export interface Resource {
  type: string
  data: Record<string, unknown>
}

export interface PoolResource {
  type: string
  data: {
    acc_token_per_share: string
    alive: boolean
    bonus_end_timestamp: string
    last_reward_timestamp: string
    number_seconds_for_user_limit: string
    pool_limit_per_user: string
    precision_factor: string
    reward_per_second: string
    staking_limit_duration: string
    start_timestamp: string
    user_staking_limit: string
  }
}

export interface PoolSyrupUserResource {
  type: string
  data: {
    amount: string
    reward_debt: string
  }
}

export interface PoolUserData {
  stakedBalance: CurrencyAmount<Currency> // amount
  pendingReward: CurrencyAmount<Currency> // reward_debt
}

export interface Pool extends PoolResource {
  isFinished?: boolean
  stakingToken: Currency
  earningToken: Currency
  userData?: PoolUserData
  vaultKey?: VaultKey
}
