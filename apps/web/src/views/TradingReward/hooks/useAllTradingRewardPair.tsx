import useSWR from 'swr'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { TRADING_REWARD_API } from 'config/constants/endpoints'
import { getTradingRewardContract } from 'utils/contractHelpers'
import { incentiveFormat } from 'views/TradingReward/utils/incentiveFormat'
import { TradingReward } from 'config/abi/types'
import { CampaignIdInfoResponse } from 'views/TradingReward/hooks/useCampaignIdInfo'

export enum RewardStatus {
  ALL = '0',
  ACTIVATED = '1',
  INACTIVATED = '2',
}

export interface AllTradingRewardPairDetail {
  campaignIds: Array<string>
  campaignPairs: { [key in string]: Array<string> }
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
      newData[campaignId].push(pairResult.data)
    }),
  )
  console.log('newData', newData)
  return newData
}

const fetchCampaignIdsIncentive = async (tradingRewardContract: TradingReward, campaignIds: Array<string>) => {
  const campaignIdsIncentive = await Promise.all(
    campaignIds.map(async (campaignId: string) => {
      const response = await tradingRewardContract.incentives(campaignId)
      return { campaignId, ...incentiveFormat(response) }
    }),
  )
  return campaignIdsIncentive
}

const initialAllTradingRewardState = {
  campaignIds: [],
  campaignPairs: {},
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

        const [campaignPairs, campaignIdsIncentive] = await Promise.all([
          fetchCampaignPairs(chainId, campaignIds),
          fetchCampaignIdsIncentive(tradingRewardContract, campaignIds),
        ])

        // return pairs.flat().filter((value, index, self) => self.indexOf(value) === index)

        const test = {
          campaignIds,
          campaignPairs,
          campaignIdsIncentive,
        }
        console.log(campaignPairs)
        return initialAllTradingRewardState
      } catch (error) {
        console.info(`Fetch All trading Reward Pair Error: ${error}`)
        return initialAllTradingRewardState
      }
    },
  )

  return {
    isFetching: isLoading,
    data: allPairs ?? initialAllTradingRewardState,
  }
}

export default useAllTradingRewardPair
