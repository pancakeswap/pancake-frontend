import { Address } from 'viem'
import { SocialHubType, UserInfo } from 'views/Profile/hooks/settingsModal/useUserSocialHub'

interface ConnectSocialProps {
  account: Address
  id: string
  userInfo: UserInfo
  type: SocialHubType
  callback: () => void
}

export const connectSocial = async ({ account, userInfo, id, type, callback }: ConnectSocialProps) => {
  let response
  const socialHubToSocialUserIdMap = {
    ...(userInfo.socialHubToSocialUserIdMap ?? {}),
    [type]: id,
  }

  // New Account
  if (userInfo.userId === null) {
    response = await fetch(`/api/userInfo/addUserInfo`, {
      method: 'POST',
      body: JSON.stringify({
        userId: account,
        socialHubToSocialUserIdMap,
      }),
    })
  } else {
    response = await fetch(`/api/userInfo/updateUserInfo`, {
      method: 'PUT',
      body: JSON.stringify({
        userId: account,
        socialHubToSocialUserIdMap,
      }),
    })
  }

  if (response.ok) {
    callback()
  }
}
