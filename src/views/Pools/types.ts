import BigNumber from 'bignumber.js'

export interface VaultUser {
  shares: BigNumber
  cakeAtLastUserAction: BigNumber
  lastDepositedTime: string
  lastUserActionTime: string
}
