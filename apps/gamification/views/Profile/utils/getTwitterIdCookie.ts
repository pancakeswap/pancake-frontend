const PCS_USER_TWITTER_ID = 'PCS_USER_TWITTER_ID'

export const getTwitterIdCookie = (twitterId: string) => {
  return `${PCS_USER_TWITTER_ID}-${twitterId}`
}

export const getSingleTaskTwitterIdCookie = (twitterId: string, taskId: string) => {
  return `${PCS_USER_TWITTER_ID}-${twitterId}-${taskId}`
}
