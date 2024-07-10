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

  try {
    const response = await fetch(`/api/twitterFollow?${queryString}`)
    return response
  } catch (error: any) {
    throw Error(error.message as string)
  }
}
