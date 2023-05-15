import useSWR from 'swr'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { getTradingRewardContract } from 'utils/contractHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Token } from '@pancakeswap/swap-sdk-core'
import { tradingRewardPairConfigChainMap } from 'views/TradingReward/config/pairs'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { AllTradingRewardPairDetail, RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

interface UseRewardBreakdownProps {
  allUserCampaignInfo: UserCampaignInfoDetail[]
  allTradingRewardPairData: AllTradingRewardPairDetail
  rewardInfo: { [key in string]: RewardInfo }
  campaignPairs: { [campaignId in string]: { [chainId in string]: Array<string> } }
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
  campaignPairs,
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
          Object.keys(campaignPairs).map(async (campaignId) => {
            const incentive = allTradingRewardPairData.campaignIdsIncentive.find(
              (i) => i.campaignId.toLowerCase() === campaignId.toLowerCase(),
            )
            const reward = rewardInfo?.[incentive.campaignId] ?? {
              rewardPrice: 0,
              rewardTokenDecimal: 18,
            }

            const pairs = await Promise.all(
              Object.keys(campaignPairs?.[campaignId]).map(async (campaignChainId) => {
                // @ts-ignore
                const farms = tradingRewardPairConfigChainMap?.[campaignChainId as ChainId]

                const data = await Promise.all(
                  campaignPairs?.[campaignId]?.[campaignChainId].map(async (lpAddress) => {
                    const pairInfo = farms.find((farm) => farm.lpAddress.toLowerCase() === lpAddress.toLowerCase())
                    const userData = allUserCampaignInfo
                      .find((user) => user.campaignId.toLowerCase() === campaignId.toLowerCase())
                      ?.tradingFeeArr.find((i) => i.pool.toLowerCase() === lpAddress.toLowerCase())

                    const canClaimResponse = !userData?.tradingFee
                      ? BIG_ZERO
                      : await tradingRewardContract.canClaim(
                          campaignId,
                          account,
                          new BigNumber(Number(userData?.tradingFee ?? 0).toFixed(8)).times(1e18).toString(),
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
                        ? userData?.estimateRewardUSD || 0
                        : rewardCakeAmount.times(rewardCakeUSDPriceAsBg).toNumber() || 0

                    return {
                      chainId: Number(campaignChainId) as ChainId,
                      address: lpAddress,
                      lpSymbol: pairInfo?.lpSymbol ?? '',
                      token: pairInfo?.token,
                      quoteToken: pairInfo?.quoteToken,
                      yourVolume: userData?.volume ?? 0,
                      rewardEarned,
                      yourTradingFee: userData?.tradingFee ?? '0',
                      feeAmount: pairInfo?.feeAmount ?? 0,
                    }
                  }),
                )

                return data
              }),
            )

            return {
              campaignId,
              campaignStart: incentive?.campaignStart ?? 0,
              campaignClaimTime: incentive?.campaignClaimTime ?? 0,
              pairs: pairs
                .reduce((a, b) => a.concat(b), [])
                .sort((a, b) => Number(b.rewardEarned) - Number(a.rewardEarned)),
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
