import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
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
    response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/addUserInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: account,
        socialHubToSocialUserIdMap,
      }),
    })
  } else {
    response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/updateUserInfo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
