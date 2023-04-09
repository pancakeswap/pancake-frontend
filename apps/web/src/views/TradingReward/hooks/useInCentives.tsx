import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getTradingRewardContract } from 'utils/contractHelpers'
import BigNumber from 'bignumber.js'

export interface Incentives {
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

const useInCentives = (campaignId: string) => {
  const { chainId } = useActiveChainId()
  const tradingRewardContract = getTradingRewardContract(chainId)

  const { data } = useSWR(
    chainId && campaignId && ['/trading-reward-incentives', chainId, campaignId],
    async () => {
      try {
        const [
          totalRewardUnclaimed,
          totalReward,
          totalVolume,
          proofRoot,
          campaignStart,
          campaignClaimTime,
          campaignClaimEndTime,
          thresholdLockedTime,
          thresholdLockedAmount,
          needProfileIsActivated,
          isActivated,
          isDynamicReward,
          dynamicRate,
        ] = await tradingRewardContract.incentives(campaignId)

        return {
          proofRoot,
          dynamicRate,
          isActivated,
          isDynamicReward,
          needProfileIsActivated,
          totalReward: new BigNumber(totalReward.toString()).toJSON(),
          totalVolume: new BigNumber(totalVolume.toString()).toJSON(),
          campaignStart: new BigNumber(campaignStart.toString()).toNumber(),
          campaignClaimTime: new BigNumber(campaignClaimTime.toString()).toNumber(),
          thresholdLockedTime: new BigNumber(thresholdLockedTime.toString()).toNumber(),
          campaignClaimEndTime: new BigNumber(campaignClaimEndTime.toString()).toNumber(),
          totalRewardUnclaimed: new BigNumber(totalRewardUnclaimed.toString()).toJSON(),
          thresholdLockedAmount: new BigNumber(thresholdLockedAmount.toString()).toJSON(),
        }
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
