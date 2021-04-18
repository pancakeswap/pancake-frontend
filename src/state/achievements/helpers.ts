import { request, gql } from 'graphql-request'
import { campaignMap } from 'config/constants/campaigns'
import { Achievement } from 'state/types'
import { getAchievementTitle, getAchievementDescription } from 'utils/achievements'

interface UserPointIncreaseEvent {
  campaignId: string
  id: string // wallet address
  points: string
}

const profileSubgraphApi = process.env.REACT_APP_SUBGRAPH_PROFILE

/**
 * Gets all user point increase events on the profile filtered by wallet address
 */
export const getUserPointIncreaseEvents = async (account: string): Promise<UserPointIncreaseEvent[]> => {
  try {
    const { user } = await request(
      profileSubgraphApi,
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
    return null
  }
}

/**
 * Gets all user point increase events and adds achievement meta
 */
export const getAchievements = async (account: string): Promise<Achievement[]> => {
  const pointIncreaseEvents = await getUserPointIncreaseEvents(account)

  if (!pointIncreaseEvents) {
    return []
  }

  return pointIncreaseEvents.reduce((accum, userPoint) => {
    const campaignMeta = campaignMap.get(userPoint.campaignId)

    return [
      ...accum,
      {
        id: userPoint.campaignId,
        type: campaignMeta.type,
        address: userPoint.id,
        title: getAchievementTitle(campaignMeta),
        description: getAchievementDescription(campaignMeta),
        badge: campaignMeta.badge,
        points: Number(userPoint.points),
      },
    ]
  }, [])
}
