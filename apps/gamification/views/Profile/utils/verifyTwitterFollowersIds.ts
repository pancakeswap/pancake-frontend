export enum TwitterFollowersId {
  TWITTER_ID_1 = 'twitter',
  TWITTER_ID_2 = 'twitter-2',
  TWITTER_ID_3 = 'twitter-3',
  TWITTER_ID_4 = 'twitter-4',
  TWITTER_ID_5 = 'twitter-5',
}

export const verifyTwitterFollowersIds = [
  // TwitterFollowersId.TWITTER_ID_2,
  TwitterFollowersId.TWITTER_ID_3,
  // TwitterFollowersId.TWITTER_ID_4,
  // TwitterFollowersId.TWITTER_ID_5,
]

export const TWITTER_CONSUMER_KEY = {
  [TwitterFollowersId.TWITTER_ID_1]: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerKeySecret: process.env.TWITTER_CONSUMER_SECRET,
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
  [TwitterFollowersId.TWITTER_ID_5]: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY_5,
    consumerKeySecret: process.env.TWITTER_CONSUMER_SECRET_5,
  },
}
