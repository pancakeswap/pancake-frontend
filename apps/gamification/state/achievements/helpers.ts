import { campaignMap } from '@pancakeswap/achievements'
import { TranslateFunction } from '@pancakeswap/localization'
import { GRAPH_API_PROFILE } from 'config/constants/endpoints'
import { Achievement } from 'config/constants/types'
import { gql, request } from 'graphql-request'
import { getAchievementDescription, getAchievementTitle } from 'utils/achievements'

interface UserPointIncreaseEvent {
  campaignId: string
  id: string // wallet address
  points: string
}

/**
 * Gets all user point increase events on the profile filtered by wallet address
 */
export const getUserPointIncreaseEvents = async (account: string): Promise<UserPointIncreaseEvent[]> => {
  try {
    const { user } = await request(
      GRAPH_API_PROFILE,
      gql`
        query getUserPointIncreaseEvents($account: ID!) {
          user(id: $account) {
            points {
              id
              campaignId
              points
            }
          }
        }
      `,
      {
        account: account.toLowerCase(),
      },
    )

    return user.points
  } catch (error) {
    return []
  }
}

/**
 * Gets all user point increase events and adds achievement meta
 */
export const getAchievements = async (account: string, t: TranslateFunction): Promise<Achievement[]> => {
  const pointIncreaseEvents = await getUserPointIncreaseEvents(account)

  if (!pointIncreaseEvents.length) {
    return []
  }

  return pointIncreaseEvents.reduce((accum: Achievement[], userPoint) => {
    if (!campaignMap.has(userPoint.campaignId)) {
      return accum
    }

    const campaignMeta = campaignMap.get(userPoint.campaignId)

    if (!campaignMeta?.type || !campaignMeta.badge) return accum

    accum.push({
      id: userPoint.campaignId,
      type: campaignMeta.type,
      address: userPoint.id,
      title: getAchievementTitle(campaignMeta, t),
      description: getAchievementDescription(campaignMeta, t),
      badge: campaignMeta.badge,
      points: Number(userPoint.points),
    })

    return accum
  }, [])
}
