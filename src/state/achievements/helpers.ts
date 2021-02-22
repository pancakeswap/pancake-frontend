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
    const events = await profileContract.queryFilter(profileContract.filters.UserPointIncrease(account), 0, 'latest')
    return events
  } catch (error) {
    console.error(error)
    return []
  }
}

/**
 * Gets all user point increase events and adds achievement meta
 */
export const getAchievements = async (account: string): Promise<Achievement[]> => {
  const pointIncreaseEvents = await getUserPointIncreaseEvents(account)
  return pointIncreaseEvents.reduce((accum, event) => {
    if (!campaignMap.has(event.args[2].toString())) {
      return accum
    }

    const campaignMeta = campaignMap.get(event.args[2].toString())

    return [
      ...accum,
      {
        id: event.args[2].toString(),
        type: campaignMeta.type,
        address: event.address,
        title: getAchievementTitle(campaignMeta),
        description: getAchievementDescription(campaignMeta),
        badge: campaignMeta.badge,
        points: Number(event.args[1].toString()),
      },
    ]
  }, [])
}
