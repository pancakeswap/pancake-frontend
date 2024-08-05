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
  callback: () => void
}

export const disconnectSocial = async ({ data, callback }: DisconnectSocialProps) => {
  const response = await fetch(`/api/userInfo/emptyUserSocialInfo`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (response.ok) {
    callback()
  } else {
    const error = await response.json()
    throw new Error(error.message)
  }
}
