import { Address } from 'viem'
import { SocialHubType } from 'views/Profile/hooks/settingsModal/useUserSocialHub'

export interface DisconnectUserSocialInfoConfig {
  socialHub: SocialHubType
  userId: Address
  signedData: { walletAddress: Address; timestamp: number }
  signature: string
}

interface DisconnectSocialProps {
  data: DisconnectUserSocialInfoConfig
  token: string
  callback: () => void
}

export const disconnectSocial = async ({ data, token, callback }: DisconnectSocialProps) => {
  const response = await fetch(`/api/userInfo/emptyUserSocialInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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
