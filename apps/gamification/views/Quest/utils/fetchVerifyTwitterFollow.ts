export interface TwitterFollowResponse {
  following: boolean
  pending_follow: boolean
}

interface FetchVerifyTwitterFollowProps {
  userId: string
  token: string
  tokenSecret: string
  targetUserId: string
}

export const fetchVerifyTwitterFollow = async ({
  userId,
  token,
  tokenSecret,
  targetUserId,
}: FetchVerifyTwitterFollowProps) => {
  const queryString = new URLSearchParams({ token, tokenSecret, userId, targetUserId }).toString()

  const response = await fetch(`/api/twitterFollow?${queryString}`)

  return response
}
