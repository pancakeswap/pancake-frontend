import { GAMIFICATION_API } from 'config/constants/endpoints'
import { Address } from 'viem'
import { SocialHubType, UserInfo } from 'views/Profile/hooks/settingsModal/useUserSocialHub'

interface DisconnectSocialProps {
  account: Address
  userInfo: UserInfo
  type: SocialHubType
  callback: () => void
}

export const disconnectSocial = async ({ account, userInfo, type, callback }: DisconnectSocialProps) => {
  const socialHubToSocialUserIdMap = {
    ...(userInfo.socialHubToSocialUserIdMap ?? {}),
    [type]: '',
  }

  const response = await fetch(`${GAMIFICATION_API}/userInfo/v1/updateUserInfo`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: account,
      socialHubToSocialUserIdMap,
    }),
  })

  if (response.ok) {
    callback()
  }
}
