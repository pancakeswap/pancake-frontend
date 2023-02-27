import { BigNumber } from '@ethersproject/bignumber'
import { Campaign, TranslatableText } from 'config/constants/types'
import ifosList from 'config/constants/ifo'
import { campaignMap } from 'config/constants/campaigns'
import { TranslateFunction } from '@pancakeswap/localization'
import { Achievement } from 'state/types'
import { multicallv2 } from 'utils/multicall'
import { getPointCenterIfoAddress } from 'utils/addressHelpers'
import pointCenterIfoABI from 'config/abi/pointCenterIfo.json'

interface IfoMapResponse {
  thresholdToClaim: string
  campaignId: string
  numberPoints: BigNumber
}

export const getAchievementTitle = (campaign: Campaign, t: TranslateFunction): TranslatableText => {
  const title = campaign.title as string

  switch (campaign.type) {
    case 'ifo':
      return t('IFO Shopper: %title%', { title })
    default:
      return campaign.title
  }
}

export const getAchievementDescription = (campaign: Campaign, t: TranslateFunction): TranslatableText => {
  const title = campaign.title as string

  switch (campaign.type) {
    case 'ifo':
      return t('Participated in the %title% IFO by committing above the minimum required amount', { title })
    default:
      return campaign.description
  }
}

/**
 * Checks if a wallet is eligible to claim points from valid IFO's
 */
export const getClaimableIfoData = async (account: string, t: TranslateFunction): Promise<Achievement[]> => {
  const ifoCampaigns = ifosList.filter((ifoItem) => ifoItem.campaignId !== undefined)

  // Returns the claim status of every IFO with a campaign ID
  const claimStatusCalls = ifoCampaigns.map(({ address }) => {
    return {
      address: getPointCenterIfoAddress(),
      name: 'checkClaimStatus',
      params: [account, address],
    }
  })

  const claimStatuses = (await multicallv2({
    abi: pointCenterIfoABI,
    calls: claimStatusCalls,
    options: { requireSuccess: false },
  })) as [boolean][] | null

  // Get IFO data for all IFO's that are eligible to claim
  const claimableIfoData = (await multicallv2({
    abi: pointCenterIfoABI,
    calls: claimStatuses.reduce((accum, claimStatusArr, index) => {
      if (claimStatusArr === null) {
        return accum
      }

      const [claimStatus] = claimStatusArr

      if (claimStatus === true) {
        return [...accum, { address: getPointCenterIfoAddress(), name: 'ifos', params: [ifoCampaigns[index].address] }]
      }

      return accum
    }, []),
  })) as IfoMapResponse[]

  // Transform response to an Achievement
  return claimableIfoData.reduce((accum, claimableIfoDataItem) => {
    const claimableCampaignId = claimableIfoDataItem.campaignId.toString()
    if (!campaignMap.has(claimableCampaignId)) {
      return accum
    }

    const campaignMeta = campaignMap.get(claimableCampaignId)
    const { address } = ifoCampaigns.find((ifoCampaign) => ifoCampaign.campaignId === claimableCampaignId)

    return [
      ...accum,
      {
        address,
        id: claimableCampaignId,
        type: 'ifo',
        title: getAchievementTitle(campaignMeta, t),
        description: getAchievementDescription(campaignMeta, t),
        badge: campaignMeta.badge,
        points: claimableIfoDataItem.numberPoints.toNumber(),
      },
    ]
  }, [])
}
