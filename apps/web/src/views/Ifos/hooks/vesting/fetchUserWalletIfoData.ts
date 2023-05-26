import { Ifo, PoolIds } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { ifoV3ABI } from 'config/abi/ifoV3'
import { Address } from 'wagmi'

export interface VestingCharacteristics {
  vestingId: string
  offeringAmountInToken: BigNumber
  vestingReleased: BigNumber
  vestingAmountTotal: BigNumber
  vestingComputeReleasableAmount: BigNumber
  vestingInformationPercentage: number
  vestingInformationDuration: number
  isVestingInitialized: boolean
}

export interface VestingData {
  ifo: Ifo
  userVestingData: {
    vestingStartTime: number
    [PoolIds.poolBasic]: VestingCharacteristics
    [PoolIds.poolUnlimited]: VestingCharacteristics
  }
}

export const fetchUserWalletIfoData = async (ifo: Ifo, account: Address): Promise<VestingData> => {
  const { address } = ifo
  let userVestingData = {
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
    const bscClient = publicClient({ chainId: ChainId.BSC })
    const [basicId, unlimitedId] = await bscClient.multicall({
      contracts: [
        {
          abi: ifoV3ABI,
          address,
          functionName: 'computeVestingScheduleIdForAddressAndPid',
          args: [account, 0n],
        },
        {
          abi: ifoV3ABI,
          address,
          functionName: 'computeVestingScheduleIdForAddressAndPid',
          args: [account, 1n],
        },
      ],
    })

    const [
      amountsResult,
      basicScheduleResult,
      unlimitedScheduleResult,
      basicReleasableAmountResult,
      unlimitedReleasableAmountResult,
      basicVestingInformationResult,
      unlimitedVestingInformationResult,
      vestingStartTimeResult,
    ] = await bscClient.multicall({
      contracts: [
        {
          abi: ifoV3ABI,
          address,
          functionName: 'viewUserOfferingAndRefundingAmountsForPools',
          args: [account, [0, 1]],
        },
        {
          abi: ifoV3ABI,
          address,
          functionName: 'getVestingSchedule',
          args: [basicId.result],
        },
        {
          abi: ifoV3ABI,
          address,
          functionName: 'getVestingSchedule',
          args: [unlimitedId.result],
        },
        {
          abi: ifoV3ABI,
          address,
          functionName: 'computeReleasableAmount',
          args: [basicId.result],
        },
        {
          abi: ifoV3ABI,
          address,
          functionName: 'computeReleasableAmount',
          args: [unlimitedId.result],
        },
        {
          abi: ifoV3ABI,
          address,
          functionName: 'viewPoolVestingInformation',
          args: [0n],
        },
        {
          abi: ifoV3ABI,
          address,
          functionName: 'viewPoolVestingInformation',
          args: [1n],
        },
        {
          abi: ifoV3ABI,
          address,
          functionName: 'vestingStartTime',
        },
      ],
    })

    const [
      amounts,
      basicSchedule,
      unlimitedSchedule,
      basicReleasableAmount,
      unlimitedReleasableAmount,
      basicVestingInformation,
      unlimitedVestingInformation,
      vestingStartTime,
    ] = [
      amountsResult.result,
      basicScheduleResult.result,
      unlimitedScheduleResult.result,
      basicReleasableAmountResult.result,
      unlimitedReleasableAmountResult.result,
      basicVestingInformationResult.result,
      unlimitedVestingInformationResult.result,
      vestingStartTimeResult.result,
    ]

    userVestingData = {
      vestingStartTime: vestingStartTime ? Number(vestingStartTime) : 0,
      [PoolIds.poolBasic]: {
        ...userVestingData[PoolIds.poolBasic],
        vestingId: basicId.status === 'success' ? basicId.result.toString() : '0',
        offeringAmountInToken: new BigNumber(amounts[0][0].toString()),
        isVestingInitialized: basicSchedule ? basicSchedule.isVestingInitialized : false,
        vestingReleased: basicSchedule ? new BigNumber(basicSchedule.released.toString()) : BIG_ZERO,
        vestingAmountTotal: basicSchedule ? new BigNumber(basicSchedule.amountTotal.toString()) : BIG_ZERO,
        vestingComputeReleasableAmount: basicReleasableAmount
          ? new BigNumber(basicReleasableAmount.toString())
          : BIG_ZERO,
        vestingInformationPercentage: basicVestingInformation ? Number(basicVestingInformation[0]) : 0,
        vestingInformationDuration: basicVestingInformation ? Number(basicVestingInformation[2]) : 0,
      },
      [PoolIds.poolUnlimited]: {
        ...userVestingData[PoolIds.poolUnlimited],
        vestingId: unlimitedId.status === 'success' ? unlimitedId.result.toString() : '0',
        offeringAmountInToken: new BigNumber(amounts[1][0].toString()),
        isVestingInitialized: unlimitedSchedule ? unlimitedSchedule.isVestingInitialized : false,
        vestingReleased: unlimitedSchedule ? new BigNumber(unlimitedSchedule.released.toString()) : BIG_ZERO,
        vestingAmountTotal: unlimitedSchedule ? new BigNumber(unlimitedSchedule.amountTotal.toString()) : BIG_ZERO,
        vestingComputeReleasableAmount: unlimitedReleasableAmount
          ? new BigNumber(unlimitedReleasableAmount.toString())
          : BIG_ZERO,
        vestingInformationPercentage: unlimitedVestingInformation ? Number(unlimitedVestingInformation[0]) : 0,
        vestingInformationDuration: unlimitedVestingInformation ? Number(unlimitedVestingInformation[2]) : 0,
      },
    }
  }

  return {
    ifo,
    userVestingData,
  }
}
