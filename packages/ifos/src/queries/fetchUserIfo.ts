import { ChainId } from '@pancakeswap/chains'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Address, GetContractReturnType, PublicClient, WalletClient, getContract } from 'viem'

import { iCakeABI } from '../abis/ICake'
import { ifoV7ABI } from '../abis/IfoV7'
import { ICAKE } from '../constants/contracts'
import { OnChainProvider, PoolIds, UserVestingData } from '../types'
import { getContractAddress } from '../utils'

export const getIfoCreditAddressContract = (
  chainId: ChainId,
  provider: OnChainProvider,
  walletClient?: WalletClient,
): GetContractReturnType<typeof iCakeABI, PublicClient, WalletClient> => {
  const address = getContractAddress(ICAKE, chainId)
  if (!address || address === '0x') {
    throw new Error(`ICAKE not supported on chain ${chainId}`)
  }
  const publicClient = provider({ chainId })

  // @ts-ignore
  return getContract({ abi: iCakeABI, address, publicClient, walletClient })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchPublicIfoData = async (chainId: ChainId | undefined, provider: OnChainProvider) => {
  return {
    ceiling: BIG_ZERO.toJSON(),
  }
}

interface Params {
  account?: Address
  chainId?: ChainId
  provider: OnChainProvider
}

// @deprecated
export const fetchUserIfoCredit = async ({ account, chainId, provider }: Params) => {
  if (!account || !chainId) {
    return BIG_ZERO.toJSON()
  }
  try {
    const ifoCreditAddressContract = getIfoCreditAddressContract(chainId, provider)
    // @ts-ignore
    const credit = await ifoCreditAddressContract.read.getUserCreditForNextIfo([account])
    return new BigNumber(credit.toString()).toJSON()
  } catch (error) {
    console.error(error)
    return BIG_ZERO.toJSON()
  }
}

type GetIfoInfoParams = Params & {
  ifo?: Address
}

export async function getUserIfoInfo({ account, ifo, chainId, provider }: GetIfoInfoParams) {
  const client = provider({ chainId })
  if (!chainId || !account || !client) {
    return {
      credit: 0n,
      endTimestamp: 0,
    }
  }

  const ifoCreditContract = getIfoCreditAddressContract(chainId, provider)
  if (!ifo) {
    // @ts-ignore
    const credit = await ifoCreditContract.read.getUserCreditForNextIfo([account])
    return {
      credit: BigInt(credit.toString()),
      endTimestamp: 0,
    }
  }

  const [endTimestamp, credit] = await client.multicall({
    contracts: [
      {
        abi: ifoV7ABI,
        address: ifo,
        functionName: 'endTimestamp',
      },
      {
        abi: ifoCreditContract.abi,
        address: ifoCreditContract.address,
        functionName: 'getUserCreditWithIfoAddr',
        args: [account, ifo],
      },
    ],
    allowFailure: false,
  })
  return {
    credit: BigInt(credit.toString()),
    endTimestamp: Number(endTimestamp.toString()),
  }
}

export async function getCurrentIfoRatio({ chainId, provider }: Omit<Params, 'account'>): Promise<number> {
  if (!chainId) {
    return 0
  }
  try {
    const ifoCreditContract = getIfoCreditAddressContract(chainId, provider)
    const [ratio, precision] = await Promise.all([
      // @ts-ignore
      ifoCreditContract.read.ratio(),
      // @ts-ignore
      ifoCreditContract.read.RATION_PRECISION(),
    ])
    return new BigNumber(ratio.toString()).div(new BigNumber(precision.toString())).toNumber()
  } catch (error) {
    console.error(error)
    return 0
  }
}

type VestingDataParams = {
  ifoAddress?: Address
} & Params

export async function fetchUserVestingData({ ifoAddress: address, account, chainId, provider }: VestingDataParams) {
  const userVestingData: UserVestingData = {
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

  const client = provider({ chainId })
  if (!client || !address || !account || !chainId) {
    return userVestingData
  }
  const [basicId, unlimitedId] = await client.multicall({
    contracts: [
      {
        abi: ifoV7ABI,
        address,
        functionName: 'computeVestingScheduleIdForAddressAndPid',
        args: [account, 0n],
      },
      {
        abi: ifoV7ABI,
        address,
        functionName: 'computeVestingScheduleIdForAddressAndPid',
        args: [account, 1n],
      },
    ],
  })
  if (!basicId.result || !unlimitedId.result) {
    throw new Error(`Vesting scheduled id not found`)
  }

  const [
    amountsResult,
    basicScheduleResult,
    unlimitedScheduleResult,
    basicReleasableAmountResult,
    unlimitedReleasableAmountResult,
    basicVestingInformationResult,
    unlimitedVestingInformationResult,
    vestingStartTimeResult,
  ] = await client.multicall({
    contracts: [
      {
        abi: ifoV7ABI,
        address,
        functionName: 'viewUserOfferingAndRefundingAmountsForPools',
        args: [account, [0, 1]],
      },
      {
        abi: ifoV7ABI,
        address,
        functionName: 'getVestingSchedule',
        args: [basicId.result],
      },
      {
        abi: ifoV7ABI,
        address,
        functionName: 'getVestingSchedule',
        args: [unlimitedId.result],
      },
      {
        abi: ifoV7ABI,
        address,
        functionName: 'computeReleasableAmount',
        args: [basicId.result],
      },
      {
        abi: ifoV7ABI,
        address,
        functionName: 'computeReleasableAmount',
        args: [unlimitedId.result],
      },
      {
        abi: ifoV7ABI,
        address,
        functionName: 'viewPoolVestingInformation',
        args: [0n],
      },
      {
        abi: ifoV7ABI,
        address,
        functionName: 'viewPoolVestingInformation',
        args: [1n],
      },
      {
        abi: ifoV7ABI,
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

  return {
    vestingStartTime: vestingStartTime ? Number(vestingStartTime) : 0,
    [PoolIds.poolBasic]: {
      ...userVestingData[PoolIds.poolBasic],
      vestingId: basicId.status === 'success' ? basicId.result.toString() : '0',
      isVestingInitialized: basicSchedule ? basicSchedule.isVestingInitialized : false,
      offeringAmountInToken: new BigNumber(amounts?.[0]?.[0]?.toString() || 0),
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
      offeringAmountInToken: new BigNumber(amounts?.[1]?.[0]?.toString() || 0),
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
