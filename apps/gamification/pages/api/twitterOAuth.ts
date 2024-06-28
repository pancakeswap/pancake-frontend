import { generateSignature, generateSignatureBaseString, generateSigningKey, percentEncode } from './oauth'

interface OAuthParams {
  oauth_consumer_key: string
  oauth_token: string
  oauth_signature_method: string
  oauth_timestamp: string
  oauth_nonce: string
  oauth_version: string
  [key: string]: string
}

export function generateOAuthHeaders(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  token: string,
  tokenSecret: string,
  params: Record<string, string> = {},
): string {
  const oauthParams: OAuthParams = {
    oauth_consumer_key: consumerKey,
    oauth_token: token,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: Math.random().toString(36).substring(7),
    oauth_version: '1.0',
  }

  const allParams = { ...oauthParams, ...params }
  const baseString = generateSignatureBaseString(method, url, allParams)
  const signingKey = generateSigningKey(consumerSecret, tokenSecret)
  const signature = generateSignature(baseString, signingKey)
  oauthParams.oauth_signature = percentEncode(signature)

  const headerParams = Object.entries(oauthParams)
    .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
    .join(', ')

  return `OAuth ${headerParams}`
}
