import { getProfileContract } from 'utils/contractHelpers'
import { campaignMap } from 'config/constants/campaigns'
import { Achievement } from 'state/types'
import { getAchievementTitle, getAchievementDescription } from 'utils/achievements'

/**
 * Gets all user point increase events on the profile filtered by wallet address
 */
export const getUserPointIncreaseEvents = async (account: string) => {
  try {
    const profileContract = getProfileContract()
    const events = await profileContract.getPastEvents('UserPointIncrease', {
      fromBlock: 'earliest',
      toBlock: 'latest',
      filter: {
        userAddress: account,
      },
    })

    return events
  } catch (error) {
    return []
  }
}

/**
 * Gets all user point increase events and adds achievement meta
 */
export const getAchievements = async (account: string): Promise<Achievement[]> => {
  const pointIncreaseEvents = await getUserPointIncreaseEvents(account)

  return pointIncreaseEvents.reduce((accum, event) => {
    if (!campaignMap.has(event.returnValues.campaignId)) {
      return accum
    }

    const campaignMeta = campaignMap.get(event.returnValues.campaignId)

    return [
      ...accum,
      {
        id: event.returnValues.campaignId,
        type: campaignMeta.type,
        address: event.address,
        title: getAchievementTitle(campaignMeta),
        description: getAchievementDescription(campaignMeta),
        badge: campaignMeta.badge,
        points: Number(event.returnValues.numberPoints),
      },
    ]
  }, [])
}
