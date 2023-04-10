import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getTradingRewardContract } from 'utils/contractHelpers'
import { incentiveFormat } from 'views/TradingReward/utils/incentiveFormat'

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
  thresholdLockedAmount: string
  thresholdLockedTime: number
  totalReward: string
  totalRewardUnclaimed: string
  totalVolume: string
}

const initialInCentivesData: Incentives = {
  campaignClaimEndTime: 0,
  campaignClaimTime: 0,
  campaignStart: 0,
  dynamicRate: 0,
  isActivated: false,
  isDynamicReward: false,
  needProfileIsActivated: false,
  proofRoot: '',
  thresholdLockedAmount: '0',
  thresholdLockedTime: 0,
  totalReward: '0',
  totalRewardUnclaimed: '0',
  totalVolume: '0',
}

const useInCentives = (campaignId: string): Incentives => {
  const { chainId } = useActiveChainId()
  const tradingRewardContract = getTradingRewardContract(chainId)

  const { data } = useSWR(
    chainId && campaignId && ['/trading-reward-incentives', chainId, campaignId],
    async () => {
      try {
        const response = await tradingRewardContract.incentives(campaignId)
        return incentiveFormat(response)
      } catch (error) {
        console.info(`Error fetching trading reward incentives error: ${error}`)
        return initialInCentivesData
      }
    },
    {},
  )
  return data ?? initialInCentivesData
}

export default useInCentives
