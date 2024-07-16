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

  const response = await fetch(`/api/userInfo/updateUserInfo`, {
    method: 'PUT',
    body: JSON.stringify({
      userId: account,
      socialHubToSocialUserIdMap,
    }),
  })

  if (response.ok) {
    callback()
  }
}
