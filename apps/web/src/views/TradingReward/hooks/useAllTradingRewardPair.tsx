import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/sdk'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { getTradingRewardContract } from 'utils/contractHelpers'
import { incentiveFormat } from 'views/TradingReward/utils/incentiveFormat'
import { TradingReward } from 'config/abi/types'

export enum RewardStatus {
  ALL = '0',
  ACTIVATED = '1',
  INACTIVATED = '2',
}

export interface Incentives {
  campaignId?: string
  totalRewardUnclaimed: string
  totalReward: string
  totalTradingFee: number
  proofRoot: string
  campaignStart: number
  campaignClaimTime: number
  campaignClaimEndTime: number
  isActivated: boolean
  isDynamicReward: boolean
  dynamicRate: number
}

export interface Qualification {
  thresholdLockTime: number
  minAmountUSD: string
}

export interface RewardInfo {
  rewardToken: string
  rewardTokenDecimal: number
  rewardPrice: string
  rewardToLockRatio: string
  rewardFeeRatio: string
}

export interface AllTradingRewardPairDetail {
  campaignIds: Array<string>
  campaignPairs: { [campaignId in string]: { [chainId in string]: Array<string> } }
  campaignIdsIncentive: Incentives[]
  qualification: Qualification
  rewardInfo: { [key in string]: RewardInfo }
}

interface AllTradingRewardPair {
  isFetching: boolean
  data: AllTradingRewardPairDetail
}

const fetchCampaignPairs = async (campaignIds: Array<string>) => {
  const newData: { [campaignId in string]: { [chainId in string]: Array<string> } } = {}
  await Promise.all(
    campaignIds.map(async (campaignId: string) => {
      const pair = await fetch(`${TRADING_REWARD_API}/campaign/pair/campaignId/${campaignId}`)
      const pairResult = await pair.json()
      newData[campaignId] = pairResult.data
    }),
  )
  return newData
}

const fetchCampaignIdsIncentive = async (tradingRewardContract: TradingReward, campaignIds: Array<string>) => {
  const campaignIdsIncentive: Incentives[] = await Promise.all(
    campaignIds.map(async (campaignId: string) => {
      const incentives = await tradingRewardContract.incentives(campaignId)
      return {
        campaignId,
        ...incentiveFormat(incentives),
      } as Incentives
    }),
  )
  return campaignIdsIncentive
}

const fetUserQualification = async (tradingRewardContract: TradingReward) => {
  const result = await tradingRewardContract.getUserQualification()
  return {
    thresholdLockTime: new BigNumber(result[0].toString()).toNumber(),
    minAmountUSD: new BigNumber(result[0].toString()).toJSON(),
  } as Qualification
}

const fetchRewardInfo = async (campaignIds: Array<string>) => {
  const newData: { [key in string]: RewardInfo } = {}
  await Promise.all(
    campaignIds.map(async (campaignId: string) => {
      const reward = await fetch(`${TRADING_REWARD_API}/reward/campaignId/${campaignId}`)
      const rewardResult = await reward.json()
      newData[campaignId] = rewardResult.data as RewardInfo
    }),
  )
  return newData
}

const initialAllTradingRewardState = {
  campaignIds: [],
  campaignPairs: {},
  campaignIdsIncentive: [],
  qualification: {
    thresholdLockTime: 0,
    minAmountUSD: '0',
  },
  rewardInfo: {},
}

const useAllTradingRewardPair = (status: RewardStatus = RewardStatus.ALL): AllTradingRewardPair => {
  const tradingRewardContract = getTradingRewardContract(ChainId.BSC)

  const { data: allPairs, isLoading } = useSWR(
    status && ['/all-activated-trading-reward-pair', status],
    async () => {
      try {
        const campaignsResponse = await fetch(`${TRADING_REWARD_API}/campaign/status/${status}`)
        const campaignsResult = await campaignsResponse.json()
        const campaignIds: Array<string> = campaignsResult.data

        const [campaignPairs, campaignIdsIncentive, qualification, rewardInfo] = await Promise.all([
          fetchCampaignPairs(campaignIds),
          fetchCampaignIdsIncentive(tradingRewardContract, campaignIds),
          fetUserQualification(tradingRewardContract),
          fetchRewardInfo(campaignIds),
        ])

        return {
          campaignIds,
          campaignPairs,
          campaignIdsIncentive,
          qualification,
          rewardInfo,
        }
      } catch (error) {
        console.info(`Fetch All trading Reward Pair Error: ${error}`)
        return initialAllTradingRewardState
      }
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      fallbackData: initialAllTradingRewardState,
    },
  )

  return {
    isFetching: isLoading,
    data: allPairs,
  }
}

export default useAllTradingRewardPair
