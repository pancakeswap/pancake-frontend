import { Campaign } from 'config/constants/types'
import { getPointCenterIfoAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/web3'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import ifosList from 'config/constants/ifo'
import { campaignMap } from 'config/constants/campaigns'
import { Achievement, TranslatableText } from 'state/types'
import makeBatchRequest from './makeBatchRequest'

interface IfoMapResponse {
  thresholdToClaim: string
  campaignId: string
  numberPoints: string
}

export const getPointCenterClaimContract = () => {
  return getContract(pointCenterIfo, getPointCenterIfoAddress())
}

export const getAchievementTitle = (campaign: Campaign): TranslatableText => {
  switch (campaign.type) {
    case 'ifo':
      return {
        id: 999,
        fallback: `IFO Shopper: ${campaign.title}`,
        data: {
          name: campaign.title as string,
        },
      }
    default:
      return campaign.title
  }
}

export const getAchievementDescription = (campaign: Campaign): TranslatableText => {
  switch (campaign.type) {
    case 'ifo':
      return {
        id: 999,
        fallback: `Committed more than $5 worth of LP in the ${campaign.title} IFO`,
        data: {
          name: campaign.title as string,
        },
      }
    default:
      return campaign.description
  }
}

/**
 * Checks if a wallet is eligble to claim points from valid IFO's
 */
export const getClaimableIfoData = async (account: string): Promise<Achievement[]> => {
  const ifoCampaigns = ifosList.filter((ifoItem) => ifoItem.campaignId !== undefined)
  const ifoCampaignAddresses = ifoCampaigns.map((ifoItem) => ifoItem.address)
  const pointCenterContract = getPointCenterClaimContract()

  // Returns the claim status of every IFO with a campaign ID
  const claimStatuses = (await pointCenterContract.methods
    .checkClaimStatuses(account, ifoCampaignAddresses)
    .call()) as boolean[]

  // Get IFO data for all IFO's that are eligible to claim
  const claimableIfoData = (await makeBatchRequest(
    claimStatuses.reduce((accum, claimStatus, index) => {
      if (claimStatus === true) {
        return [...accum, pointCenterContract.methods.ifos(ifoCampaignAddresses[index]).call]
      }

      return accum
    }, []),
  )) as IfoMapResponse[]

  // Transform response to an Achievement
  return claimableIfoData.reduce((accum, claimableIfoDataItem) => {
    if (!campaignMap.has(claimableIfoDataItem.campaignId)) {
      return accum
    }

    const campaignMeta = campaignMap.get(claimableIfoDataItem.campaignId)
    const { address } = ifoCampaigns.find((ifoCampaign) => ifoCampaign.campaignId === claimableIfoDataItem.campaignId)

    return [
      ...accum,
      {
        address,
        id: claimableIfoDataItem.campaignId,
        type: 'ifo',
        title: getAchievementTitle(campaignMeta),
        description: getAchievementDescription(campaignMeta),
        badge: campaignMeta.badge,
        points: Number(claimableIfoDataItem.numberPoints),
      },
    ]
  }, [])
}
