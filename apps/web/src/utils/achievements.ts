import { Campaign, TranslatableText } from 'config/constants/types'
import ifosList from 'config/constants/ifo'
import { campaignMap } from 'config/constants/campaigns'
import { TranslateFunction } from '@pancakeswap/localization'
import { Achievement } from 'state/types'
import { ChainId } from '@pancakeswap/sdk'
import { getPointCenterIfoAddress } from 'utils/addressHelpers'
import { pointCenterIfoABI } from 'config/abi/pointCenterIfo'
import { Address, ContractFunctionResult } from 'viem'
import { publicClient } from './wagmi'

interface IfoMapResponse {
  thresholdToClaim: string
  campaignId: string
  numberPoints: bigint
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

  const bscClient = publicClient({ chainId: ChainId.BSC })

  // Returns the claim status of every IFO with a campaign ID
  const claimStatusesResults = await bscClient.multicall({
    contracts: ifoCampaigns.map(
      ({ address }) =>
        ({
          abi: pointCenterIfoABI,
          address: getPointCenterIfoAddress(),
          functionName: 'checkClaimStatus',
          args: [account as Address, address] as const,
        } as const),
    ),
    allowFailure: true,
  })

  const claimStatuses = claimStatusesResults.map((result) => result.result)

  const calls = claimStatuses.reduce((accum, claimStatusArr, index) => {
    if (claimStatusArr === true) {
      return [
        ...accum,
        {
          abi: pointCenterIfoABI,
          address: getPointCenterIfoAddress(),
          functionName: 'ifos',
          args: [ifoCampaigns[index].address],
        },
      ]
    }

    return accum
  }, [])

  // Get IFO data for all IFO's that are eligible to claim
  const claimableIfoDataResult = (await bscClient.multicall({
    contracts: calls,
    allowFailure: false,
  })) as ContractFunctionResult<typeof pointCenterIfoABI, 'ifos'>[]

  const claimableIfoData = claimableIfoDataResult.map(
    (result) =>
      ({
        thresholdToClaim: result[0].toString(),
        campaignId: result[1].toString(),
        numberPoints: result[2],
      } as IfoMapResponse),
  )

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
        points: Number(claimableIfoDataItem.numberPoints),
      },
    ]
  }, [])
}
