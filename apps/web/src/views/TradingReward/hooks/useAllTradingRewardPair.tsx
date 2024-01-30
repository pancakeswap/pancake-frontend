import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { useTradingRewardContract, useTradingRewardTopTraderContract } from 'hooks/useContract'
import { getTradingRewardContract } from 'utils/contractHelpers'

export enum RewardStatus {
  ALL = '0',
  ACTIVATED = '1',
  INACTIVATED = '2',
}

export enum RewardType {
  CAKE_STAKERS = 'rbTest', // rb -> Prod, rbTest -> test // TODO: revert before merge
  TOP_TRADERS = 'ttTest', // tt -> Prod, ttTest -> test // TODO: revert before merge
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
  thresholdLockAmount: number
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

interface UseAllTradingRewardPairProps {
  status: RewardStatus
  type: RewardType
}

const fetchCampaignPairs = async (campaignIds: Array<string>, type: RewardType) => {
  const newData: { [campaignId in string]: { [chainId in string]: Array<string> } } = {}
  await Promise.all(
    campaignIds.map(async (campaignId: string) => {
      const pair = await fetch(`${TRADING_REWARD_API}/campaign/pair/campaignId/${campaignId}/type/${type}`)
      const pairResult = await pair.json()
      newData[campaignId] = pairResult.data
    }),
  )
  return newData
}

const fetchCampaignIdsIncentive = async (
  tradingRewardContract: ReturnType<typeof getTradingRewardContract>,
  campaignIds: Array<string>,
) => {
  const campaignIdsIncentive: Incentives[] = await Promise.all(
    campaignIds.map(async (campaignId: string) => {
      const incentives = await tradingRewardContract.read.incentives([campaignId])
      const [
        totalRewardUnclaimed,
        totalReward,
        totalTradingFee,
        proofRoot,
        campaignStart,
        campaignClaimTime,
        campaignClaimEndTime,
        isActivated,
        isDynamicReward,
      ] = incentives

      const formatted = {
        proofRoot,
        isActivated,
        isDynamicReward,
        totalReward: new BigNumber(totalReward.toString()).toJSON(),
        totalTradingFee: new BigNumber(totalTradingFee.toString()).toNumber(),
        campaignStart: new BigNumber(campaignStart.toString()).toNumber(),
        campaignClaimTime: new BigNumber(campaignClaimTime.toString()).toNumber(),
        campaignClaimEndTime: new BigNumber(campaignClaimEndTime.toString()).toNumber(),
        totalRewardUnclaimed: new BigNumber(totalRewardUnclaimed.toString()).toJSON(),
      }
      return {
        campaignId,
        ...formatted,
      } as Incentives
    }),
  )
  return campaignIdsIncentive
}

const fetUserQualification = async (tradingRewardContract: ReturnType<typeof getTradingRewardContract>) => {
  const result = await tradingRewardContract.read.getUserQualification()
  return {
    thresholdLockTime: new BigNumber(result[0].toString()).toNumber(),
    thresholdLockAmount: new BigNumber(result[1].toString()).toNumber(),
    minAmountUSD: new BigNumber(result[3].toString()).toJSON(),
  } as Qualification
}

const fetchRewardInfo = async (campaignIds: Array<string>, type: RewardType) => {
  const newData: { [key in string]: RewardInfo } = {}
  await Promise.all(
    campaignIds.map(async (campaignId: string) => {
      const reward = await fetch(`${TRADING_REWARD_API}/reward/campaignId/${campaignId}/type/${type}`)
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
    thresholdLockAmount: 0,
    minAmountUSD: '0',
  },
  rewardInfo: {},
}

const useAllTradingRewardPair = ({ status, type }: UseAllTradingRewardPairProps): AllTradingRewardPair => {
  const tradingRewardContract = useTradingRewardContract({ chainId: ChainId.BSC })
  const tradingRewardTopTradersContract = useTradingRewardTopTraderContract({ chainId: ChainId.BSC })
  const contract = type === RewardType.CAKE_STAKERS ? tradingRewardContract : tradingRewardTopTradersContract

  const { data: allPairs, isPending } = useQuery({
    queryKey: ['tradingReward', 'all-activated-trading-reward-pair', status, type],

    queryFn: async () => {
      try {
        const campaignsResponse = await fetch(`${TRADING_REWARD_API}/campaign/status/${status}/type/${type}`)
        const campaignsResult = await campaignsResponse.json()
        const campaignIds: Array<string> = campaignsResult.data

        const [campaignPairs, campaignIdsIncentive, qualification, rewardInfo] = await Promise.all([
          fetchCampaignPairs(campaignIds, type),
          fetchCampaignIdsIncentive(contract, campaignIds),
          fetUserQualification(contract),
          fetchRewardInfo(campaignIds, type),
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

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: initialAllTradingRewardState,
    enabled: Boolean(status && type),
  })

  return {
    isFetching: isPending,
    data: allPairs,
  }
}

export default useAllTradingRewardPair
