// eslint-disable-next-line @typescript-eslint/no-var-requires
import { TWITTER_CONSUMER_KEY, TwitterFollowersId } from 'views/Profile/utils/verifyTwitterFollowersIds'
// import { TaskType } from 'views/DashboardQuestEdit/type'
import { getOAuthHeader } from 'utils/getOAuthHeader'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { token, tokenSecret, twitterPostId, providerId } = req.query
      if (!token || !tokenSecret || !twitterPostId || !providerId) {
        res.status(400).json({ message: 'Missing required parameters: token, tokenSecret, twitterPostId, providerId' })
        return
      }

      // const consumerKey = process.env.TWITTER_CONSUMER_KEY as string
      // const consumerSecret = process.env.TWITTER_CONSUMER_SECRET as string
      const consumerKey = TWITTER_CONSUMER_KEY[providerId as TwitterFollowersId].consumerKey as string
      const consumerSecret = TWITTER_CONSUMER_KEY[providerId as TwitterFollowersId].consumerKeySecret as string

      // const credentials = `${consumerKey}:${consumerSecret}`
      // const encodedCredentials = btoa(credentials)
      // const params = new URLSearchParams()
      // params.append('grant_type', 'client_credentials')

      // const fetchBearerTokenResponse = await fetch('https://api.twitter.com/oauth2/token', {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Basic ${encodedCredentials}`,
      //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //   },
      //   body: params,
      // })
      // const getBearerToken = await fetchBearerTokenResponse.json()
      // const bearerToken = getBearerToken.access_token
      // console.log('bearerToken', bearerToken)

      const url = `https://api.twitter.com/2/users/${twitterPostId}/liked_tweets`
      const method = 'GET'
      const response = await fetch(url, {
        method,
        headers: {
          ...getOAuthHeader(url, method, consumerKey, consumerSecret, token, tokenSecret),
          'Content-Type': 'application/json',
        },
      })
      // const result = await response.json()
      // console.log('result', result)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
