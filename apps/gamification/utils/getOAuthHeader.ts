import crypto from 'crypto'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const OAuth = require('oauth-1.0a')

export const getOAuthHeader = (
  url: string,
  method: string,
  consumerKey: string,
  consumerSecret: string,
  token: string,
  tokenSecret: string,
): { Authorization: string } => {
  const oauth = new OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString: string, key: string) {
      return crypto.createHmac('sha1', key).update(baseString).digest('base64')
    },
  })

  const requestData = { url, method }
  return oauth.toHeader(oauth.authorize(requestData, { key: token, secret: tokenSecret }))
}
