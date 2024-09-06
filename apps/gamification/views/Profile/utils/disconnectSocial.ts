import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
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
  fetchWithSiweAuth: (input: RequestInfo | URL, init: RequestInit | undefined) => Promise<Response>
  callback: () => void
}

export const disconnectSocial = async ({ data, fetchWithSiweAuth, callback }: DisconnectSocialProps) => {
  const response = await fetchWithSiweAuth(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/emptyUserSocialInfo`, {
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
