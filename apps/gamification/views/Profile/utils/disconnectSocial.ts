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
  const response = await fetchWithSiweAuth(`/api/userInfo/emptyUserSocialInfo`, {
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
