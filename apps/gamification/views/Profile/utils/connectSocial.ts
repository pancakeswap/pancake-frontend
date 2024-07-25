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
  user_name?: string
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
  callback: () => void
}

export const connectSocial = async ({ userInfo, data, callback }: ConnectSocialProps) => {
  let response

  // New Account
  if (userInfo.userId === null) {
    response = await fetch(`/api/userInfo/addUserInfo`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } else {
    response = await fetch(`/api/userInfo/updateUserInfo`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  if (response.ok) {
    callback()
  }
}
