import useSWR from 'swr'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { getTradingRewardContract } from 'utils/contractHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Token } from '@pancakeswap/swap-sdk-core'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { AllTradingRewardPairDetail, RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

interface UseRewardBreakdownProps {
  allUserCampaignInfo: UserCampaignInfoDetail[]
  allTradingRewardPairData: AllTradingRewardPairDetail
  rewardInfo: { [key in string]: RewardInfo }
}

export interface RewardBreakdownPair {
  chainId: ChainId
  address: string
  lpSymbol: string
  token: Token
  quoteToken: Token
  yourVolume: number
  rewardEarned: number
  yourTradingFee: string
  feeAmount: number
}

export interface RewardBreakdownDetail {
  campaignId: string
  campaignStart: number
  campaignClaimTime: number
  pairs: RewardBreakdownPair[]
}

export interface RewardBreakdown {
  isFetching: boolean
  data: RewardBreakdownDetail[]
}

const useRewardBreakdown = ({
  allUserCampaignInfo,
  allTradingRewardPairData,
  rewardInfo,
}: UseRewardBreakdownProps): RewardBreakdown => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const tradingRewardContract = getTradingRewardContract(chainId)
  const currentDate = new Date().getTime() / 1000

  const { data: rewardBreakdownList, isLoading } = useSWR(
    ['/rewards-breakdown', allUserCampaignInfo, allTradingRewardPairData, account],
    async () => {
      try {
        const dataInfo = await Promise.all(
          allUserCampaignInfo.map(async (info) => {
            const incentive = allTradingRewardPairData.campaignIdsIncentive.find(
              (i) => i.campaignId.toLowerCase() === info.campaignId.toLowerCase(),
            )
            const reward = rewardInfo?.[incentive.campaignId] ?? {
              rewardPrice: 0,
              rewardTokenDecimal: 18,
            }

            const pairs = await Promise.all(
              info.tradingFeeArr.map(async (fee) => {
                const farms = farmsV3ConfigChainMap[fee.chainId as ChainId]
                const pairInfo = farms.find((farm) => farm.lpAddress.toLowerCase() === fee.pool.toLowerCase())

                const canClaimResponse = !fee.tradingFee
                  ? BIG_ZERO
                  : await tradingRewardContract.canClaim(
                      info.campaignId,
                      account,
                      new BigNumber(Number(fee.tradingFee).toFixed(8)).times(1e18).toString(),
                    )

                const rewardCakeUSDPriceAsBg = getBalanceAmount(
                  new BigNumber(reward.rewardPrice),
                  reward.rewardTokenDecimal,
                )
                const rewardCakeAmount = getBalanceAmount(
                  new BigNumber(canClaimResponse.toString()),
                  reward.rewardTokenDecimal,
                )

                const rewardEarned =
                  incentive.campaignClaimTime - currentDate > 0
                    ? fee.estimateRewardUSD || 0
                    : rewardCakeAmount.times(rewardCakeUSDPriceAsBg).toNumber() || 0

                return {
                  chainId: fee.chainId,
                  address: fee.pool,
                  lpSymbol: pairInfo?.lpSymbol ?? '',
                  token: pairInfo?.token,
                  quoteToken: pairInfo?.quoteToken,
                  yourVolume: fee.volume,
                  rewardEarned,
                  yourTradingFee: fee.tradingFee,
                  feeAmount: pairInfo?.feeAmount ?? 0,
                }
              }),
            )

            return {
              campaignId: info.campaignId,
              campaignStart: incentive?.campaignStart ?? 0,
              campaignClaimTime: incentive?.campaignClaimTime ?? 0,
              pairs: pairs.sort((a, b) => Number(b.rewardEarned) - Number(a.rewardEarned)),
            }
          }),
        )

        return dataInfo
      } catch (error) {
        console.info(`Fetch Reward Breakdown Error: ${error}`)
        return []
      }
    },
    {
      fallbackData: [],
    },
  )

  return {
    isFetching: isLoading,
    data: rewardBreakdownList,
  }
}

export default useRewardBreakdown
