import oauth from 'oauth'

const TWITTER_CONSUMER_KEY = 'RJ12hrPqKJHP4wHryCyMg5wUz' // Replace with your key
const TWITTER_CONSUMER_SECRET = '1d9gwSMNDWFKTXlIckSbaMB7lZkytPZSUqZh4DFc2LlREvFNmh' // Replace with your secret

const consumer = new oauth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  '1.0A',
  'https://gamification-git-gamification-v1-pre.pancake.run/profile',
  'HMAC-SHA1',
)

export const useConnectTwitter = () => {
  const fetchOauthToken = async () => {
    let OauthToken: string = ''
    let OauthTokenSecret: string = ''
    consumer.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
      if (!error) {
        console.log(oauthToken, oauthTokenSecret)
        OauthToken = oauthToken
        OauthTokenSecret = oauthTokenSecret
      } else {
        console.log('Failed to get request twitter oauth token', error)
      }
    })
    return {
      OauthToken,
      OauthTokenSecret,
    }
  }

  const fetchUserInfo = async (oauthToken, oauthVerifier) => {
    consumer.getOAuthAccessToken(oauthToken, null, oauthVerifier, (error, oauthAccessToken, oauthAccessTokenSecret) => {
      if (!error) {
        consumer.get(
          'https://api.twitter.com/1.1/account/verify_credentials.json',
          oauthAccessToken,
          oauthAccessTokenSecret,
          (userDataError, data) => {
            if (!userDataError) {
              console.log({ ...JSON.parse(data), oauthAccessToken, oauthAccessTokenSecret })
            } else {
              console.log('Fail get user twitter info', error)
            }
          },
        )
      } else {
        console.log('Failed to get request twitter oauth token', error)
      }
    })
  }

  const connect = async () => {
    try {
      const { OauthToken } = await fetchOauthToken()

      // Redirect to Twitter for authorization
      window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${OauthToken}`
    } catch (error) {
      console.error('Error obtaining request token', error)
    }
  }

  return {
    connect,
  }
}
