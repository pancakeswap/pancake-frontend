interface TwitterFollow {
  following: boolean
  pending_follow: boolean
}

interface FetchVerifyTwitterFollowProps {
  userId: string
  token: string
  tokenSecret: string
  targetUserId: string
  callback?: () => void
}

export const fetchVerifyTwitterFollow = async ({
  userId,
  token,
  tokenSecret,
  targetUserId,
  callback,
}: FetchVerifyTwitterFollowProps) => {
  const queryString = new URLSearchParams({ token, tokenSecret, userId, targetUserId }).toString()

  const response = await fetch(`/api/twitterFollow?${queryString}`)

  if (!response.ok) {
    console.error('Fetch Verify Twitter Follow error: ', response)
    throw new Error(`Fetch Verify Twitter Follow error`)
  }

  const result = await response.json()
  const followData: TwitterFollow = result.data

  const publicUserSuccess = followData?.following === true && followData?.pending_follow === false
  const protectedUserSuccess = followData?.following === false && followData?.pending_follow === true

  if (publicUserSuccess || protectedUserSuccess) {
    // Fetch api to BE, if complete call callback()
    // TODO: Need let be know user is followed
  }
}
