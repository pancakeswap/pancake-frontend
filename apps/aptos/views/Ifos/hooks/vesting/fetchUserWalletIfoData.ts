import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'

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

export const fetchUserWalletIfoData = async (ifo: Ifo, account: string): Promise<VestingData> => {
  const userVestingData = {
    vestingStartTime: 0,
    poolBasic: {
      vestingId: '0',
      offeringAmountInToken: BIG_ZERO,
      isVestingInitialized: false,
      vestingReleased: BIG_ZERO,
      vestingAmountTotal: BIG_ZERO,
      vestingComputeReleasableAmount: BIG_ZERO,
      vestingInformationPercentage: 0,
      vestingInformationDuration: 0,
    },
    poolUnlimited: {
      vestingId: '0',
      offeringAmountInToken: BIG_ZERO,
      isVestingInitialized: false,
      vestingReleased: BIG_ZERO,
      vestingAmountTotal: BIG_ZERO,
      vestingComputeReleasableAmount: BIG_ZERO,
      vestingInformationPercentage: 0,
      vestingInformationDuration: 0,
    },
  }

  if (account) {
    // TODO: Aptos
  }

  return {
    ifo,
    userVestingData,
  }
}
