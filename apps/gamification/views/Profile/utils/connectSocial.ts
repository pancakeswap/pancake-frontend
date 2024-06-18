import { GAMIFICATION_API } from 'config/constants/endpoints'
import { Address } from 'viem'
import { SocialHubType } from 'views/Profile/hooks/settingsModal/useUserSocialHub'

interface ConnectSocialProps {
  account: Address
  id: string
  type: SocialHubType
  callback: () => void
}

export const connectSocial = async ({ account, id, type, callback }: ConnectSocialProps) => {
  const response = await fetch(`${GAMIFICATION_API}/userInfo/v1/addUserInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: account,
      socialHubToSocialUserIdMap: {
        [type]: id,
      },
    }),
  })

  if (response.ok) {
    callback()
  }
}
