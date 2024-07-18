export enum TwitterFollowersId {
  TWITTER_ID_1 = 'twitter',
  TWITTER_ID_2 = 'twitter-2',
  TWITTER_ID_3 = 'twitter-3',
  TWITTER_ID_4 = 'twitter-4',
}

export const verifyTwitterFollowersIds = [
  TwitterFollowersId.TWITTER_ID_1,
  // TwitterFollowersId.TWITTER_ID_2,
  // TwitterFollowersId.TWITTER_ID_3,
  // TwitterFollowersId.TWITTER_ID_4,
]

export const TWITTER_CONSUMER_KEY = {
  [TwitterFollowersId.TWITTER_ID_1]: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY_1,
    consumerKeySecret: process.env.TWITTER_CONSUMER_SECRET_1,
  },
  [TwitterFollowersId.TWITTER_ID_2]: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY_2,
    consumerKeySecret: process.env.TWITTER_CONSUMER_SECRET_2,
  },
  [TwitterFollowersId.TWITTER_ID_3]: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY_3,
    consumerKeySecret: process.env.TWITTER_CONSUMER_SECRET_3,
  },
  [TwitterFollowersId.TWITTER_ID_4]: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY_4,
    consumerKeySecret: process.env.TWITTER_CONSUMER_SECRET_4,
  },
}
