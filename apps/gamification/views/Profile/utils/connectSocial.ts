import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { Address } from 'viem'
import { SocialHubType, UserInfo } from 'views/Profile/hooks/settingsModal/useUserSocialHub'

export interface VerificationDataBaseConfig {
  id: string
}

export interface VerificationTwitterConfig extends VerificationDataBaseConfig {
  oauth_token?: string
  oauth_token_secret?: string
}

export interface VerificationDiscordConfig extends VerificationDataBaseConfig {
  access_token?: string
}

export interface VerificationTelegramConfig extends VerificationDataBaseConfig {
  hash?: string
  auth_date?: number
  first_name?: string
  username?: string
  photo_url?: string
}

export type VerificationDataType = VerificationTwitterConfig | VerificationDiscordConfig | VerificationTelegramConfig

interface SubmitSocialData {
  socialMedia: SocialHubType
  userId: Address
  signedData: { walletAddress: Address; timestamp: number }
  verificationData: VerificationDataType
  signature: string
}

interface ConnectSocialProps {
  data: SubmitSocialData
  userInfo: UserInfo
  fetchWithSiweAuth: (input: RequestInfo | URL, init: RequestInit | undefined) => Promise<Response>
  callback: () => void
}

export const connectSocial = async ({ userInfo, data, fetchWithSiweAuth, callback }: ConnectSocialProps) => {
  if (userInfo.socialHubToSocialUserIdMap === null || !userInfo.socialHubToSocialUserIdMap[data.socialMedia]) {
    const response = await fetchWithSiweAuth(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/addUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      callback()
    } else {
      const error = await response.json()
      throw new Error(error.message)
    }
  }
}
