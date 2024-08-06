import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import TwitterProvider from 'next-auth/providers/twitter'
import { TWITTER_CONSUMER_KEY, TwitterFollowersId } from 'views/Profile/utils/verifyTwitterFollowersIds'

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
    // For login
    TwitterProvider({
      id: 'twitter',
      clientId: process.env.TWITTER_CONSUMER_KEY ?? '',
      clientSecret: process.env.TWITTER_CONSUMER_SECRET ?? '',
    }),
    // For verify followers
    TwitterProvider({
      id: TwitterFollowersId.TWITTER_ID_2,
      clientId: TWITTER_CONSUMER_KEY[TwitterFollowersId.TWITTER_ID_2].consumerKey ?? '',
      clientSecret: TWITTER_CONSUMER_KEY[TwitterFollowersId.TWITTER_ID_2].consumerKeySecret ?? '',
    }),
    TwitterProvider({
      id: TwitterFollowersId.TWITTER_ID_3,
      clientId: TWITTER_CONSUMER_KEY[TwitterFollowersId.TWITTER_ID_3].consumerKey ?? '',
      clientSecret: TWITTER_CONSUMER_KEY[TwitterFollowersId.TWITTER_ID_3].consumerKeySecret ?? '',
    }),
  ],
  session: {
    maxAge: 3, // 3 sec
  },
  pages: {
    signIn: '/profile',
  },
  callbacks: {
    async jwt(params: any) {
      const { token, account, profile } = params
      // Initial sign-in
      if (account && profile) {
        // eslint-disable-next-line default-case
        switch (account.provider) {
          case 'discord':
            // eslint-disable-next-line no-param-reassign
            token.discord = {
              discordId: profile.id,
              token: account.access_token,
            }
            break
          case 'twitter':
          case TwitterFollowersId.TWITTER_ID_2:
          case TwitterFollowersId.TWITTER_ID_3:
          case TwitterFollowersId.TWITTER_ID_4:
          case TwitterFollowersId.TWITTER_ID_5:
            // eslint-disable-next-line no-param-reassign
            token.twitter = {
              providerId: account.provider,
              twitterId: profile.id_str,
              token: account.oauth_token,
              tokenSecret: account.oauth_token_secret,
            }
            break
        }
      }
      return token
    },
    async session(params) {
      const { session, token } = params
      // eslint-disable-next-line no-param-reassign
      ;(session as any).user.discord = token.discord || null
      // eslint-disable-next-line no-param-reassign
      ;(session as any).user.twitter = token.twitter || null
      return session
    },

    // async redirect({ url, baseUrl }) {
    //   return url
    //   // return `${baseUrl}/profile`
    // },
  },
})
