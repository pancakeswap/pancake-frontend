import { Ifo, PoolIds } from 'config/constants/types'
import { getIfoV3Contract } from 'utils/contractHelpers'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { multicallv2 } from 'utils/multicall'
import ifoV3Abi from 'config/abi/ifoV3.json'

export interface VestingCharacteristics {
  vestingId: string
  offeringAmountInToken: BigNumber
  vestingReleased: BigNumber
  vestingAmountTotal: BigNumber
  vestingcomputeReleasableAmount: BigNumber
  vestingInfomationPercentage: number
}

export interface VestingData {
  ifo: Ifo
  userVestingData: {
    [PoolIds.poolUnlimited]: VestingCharacteristics
  }
}

export const fetchUserWalletIfoData = async (ifo: Ifo, account: string): Promise<VestingData> => {
  const { address } = ifo
  const readContract = getIfoV3Contract(address)
  let userVestingData = {
    poolUnlimited: {
      vestingId: '0',
      offeringAmountInToken: BIG_ZERO,
      vestingReleased: BIG_ZERO,
      vestingAmountTotal: BIG_ZERO,
      vestingcomputeReleasableAmount: BIG_ZERO,
      vestingInfomationPercentage: 0,
    },
  }

  if (account) {
    const vestingId = await readContract.computeVestingScheduleIdForAddressAndIndex(account, 0)
    const ifov3Calls = [
      {
        address,
        name: 'viewUserOfferingAndRefundingAmountsForPools',
        params: [account, [1]],
      },
      {
        address,
        name: 'getVestingSchedule',
        params: [vestingId],
      },
      {
        address,
        name: 'computeReleasableAmount',
        params: [vestingId],
      },
      {
        address,
        name: 'viewPoolVestingInformation',
        params: [1],
      },
    ]

    const [amounts, vestingSchedule, computeReleasableAmount, unlimitedVestingInformation] = await multicallv2(
      ifoV3Abi,
      ifov3Calls,
      { requireSuccess: false },
    )

    userVestingData = {
      ...userVestingData,
      [PoolIds.poolUnlimited]: {
        ...userVestingData[PoolIds.poolUnlimited],
        vestingId: vestingId ? vestingId.toString() : '0',
        offeringAmountInToken: new BigNumber(amounts[0][0][0].toString()),
        vestingReleased: vestingSchedule ? new BigNumber(vestingSchedule[0].released.toString()) : BIG_ZERO,
        vestingAmountTotal: vestingSchedule ? new BigNumber(vestingSchedule[0].amountTotal.toString()) : BIG_ZERO,
        vestingcomputeReleasableAmount: computeReleasableAmount
          ? new BigNumber(computeReleasableAmount.toString())
          : BIG_ZERO,
        vestingInfomationPercentage: unlimitedVestingInformation ? unlimitedVestingInformation[0].toNumber() : 0,
      },
    }
  }

  return {
    ifo,
    userVestingData,
  }
}
