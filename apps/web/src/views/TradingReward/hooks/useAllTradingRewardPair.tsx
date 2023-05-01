import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
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
  campaignClaimEndTime: number
  campaignClaimTime: number
  campaignStart: number
  dynamicRate: number
  isActivated: boolean
  isDynamicReward: boolean
  needProfileIsActivated: boolean
  proofRoot: string
  totalReward: string
  totalRewardUnclaimed: string
  totalVolume: string
  rewardPrice: string
  rewardTokenDecimals: number
}

export interface Qualification {
  thresholdLockTime: number
  thresholdLockAmount: string
}

export interface AllTradingRewardPairDetail {
  campaignIds: Array<string>
  campaignPairs: { [key in string]: Array<string> }
  campaignIdsIncentive: Incentives[]
  qualification: Qualification
}

interface AllTradingRewardPair {
  isFetching: boolean
  data: AllTradingRewardPairDetail
}

const fetchCampaignPairs = async (chainId: number, campaignIds: Array<string>) => {
  const newData: { [key in string]: Array<string> } = {}
  await Promise.all(
    campaignIds.map(async (campaignId: string) => {
      const pair = await fetch(`${TRADING_REWARD_API}/campaign/pair/chainId/${chainId}/campaignId/${campaignId}`)
      const pairResult = await pair.json()
      if (newData[campaignId]) {
        newData[campaignId].push(pairResult.data)
      } else {
        newData[campaignId] = [pairResult.data]
      }
    }),
  )
  return newData
}

const fetchCampaignIdsIncentive = async (tradingRewardContract: TradingReward, campaignIds: Array<string>) => {
  const campaignIdsIncentive: Incentives[] = await Promise.all(
    campaignIds.map(async (campaignId: string) => {
      const [incentives, incentiveRewards] = await Promise.all([
        tradingRewardContract.incentives(campaignId),
        tradingRewardContract.incentiveRewards(campaignId),
      ])

      return {
        campaignId,
        rewardPrice: new BigNumber(incentiveRewards[1].toString()).toJSON(),
        rewardTokenDecimals: 18, // TODO: get from API, ask Cupcake
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
    thresholdLockAmount: new BigNumber(result[1].toString()).toJSON(),
  } as Qualification
}

const initialAllTradingRewardState = {
  campaignIds: [],
  campaignPairs: {},
  campaignIdsIncentive: [],
  qualification: {
    thresholdLockTime: 0,
    thresholdLockAmount: '0',
  },
}

const useAllTradingRewardPair = (status: RewardStatus = RewardStatus.ALL): AllTradingRewardPair => {
  const { chainId } = useActiveChainId()
  const tradingRewardContract = getTradingRewardContract(chainId)

  const { data: allPairs, isLoading } = useSWR(
    chainId && status && ['/all-activated-trading-reward-pair', chainId, status],
    async () => {
      try {
        const campaignsResponse = await fetch(`${TRADING_REWARD_API}/campaign/status/${status}/chainId/${chainId}`)
        const campaignsResult = await campaignsResponse.json()
        const campaignIds: Array<string> = campaignsResult.data

        const [campaignPairs, campaignIdsIncentive, qualification] = await Promise.all([
          fetchCampaignPairs(chainId, campaignIds),
          fetchCampaignIdsIncentive(tradingRewardContract, campaignIds),
          fetUserQualification(tradingRewardContract),
        ])

        return {
          campaignIds,
          campaignPairs,
          campaignIdsIncentive,
          qualification,
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
