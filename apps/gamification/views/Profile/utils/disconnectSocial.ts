import { GAMIFICATION_API } from 'config/constants/endpoints'
import { Address } from 'viem'
import { SocialHubType } from 'views/Profile/hooks/settingsModal/useUserSocialHub'

interface DisconnectSocialProps {
  account: Address
  type: SocialHubType
  callback: () => void
}

export const disconnectSocial = async ({ account, type, callback }: DisconnectSocialProps) => {
  const response = await fetch(`${GAMIFICATION_API}/userInfo/v1/updateUserInfo`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: account,
      socialHubToSocialUserIdMap: {
        [type]: '',
      },
    }),
  })

  if (response.ok) {
    callback()
  }
}
