import { Ifo, PoolIds } from 'config/constants/types'
import BigNumber from 'bignumber.js'

export interface VestingCharacteristics {
  vestingId: string
  offeringAmountInToken: BigNumber
  vestingReleased: BigNumber
  vestingAmountTotal: BigNumber
  vestingComputeReleasableAmount: BigNumber
  vestingInformationPercentage: number
  vestingInformationDuration: number
}

export interface VestingData {
  ifo: Ifo
  userVestingData: {
    vestingStartTime: number
    [PoolIds.poolBasic]: VestingCharacteristics
    [PoolIds.poolUnlimited]: VestingCharacteristics
  }
}
