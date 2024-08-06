import crypto from 'crypto'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
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
    CredentialsProvider({
      id: 'telegram',
      name: 'Telegram',
      credentials: {
        id: { label: 'ID', type: 'text' },
        first_name: { label: 'First Name', type: 'text' },
        last_name: { label: 'Last Name', type: 'text' },
        username: { label: 'Username', type: 'text' },
        photo_url: { label: 'Photo URL', type: 'text' },
        auth_date: { label: 'Auth Date', type: 'text' },
        hash: { label: 'Hash', type: 'text' },
      },
      async authorize(credentials) {
        const { hash, ...authData } = credentials as any
        const secret = crypto
          .createHash('sha256')
          .update(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN as string, 'utf8')
          .digest()

        const dataCheckString = Object.keys(authData)
          .sort()
          .map((key) => `${key}=${authData[key]}`)
          .join('\n')

        const checkHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex')

        if (checkHash !== hash) {
          throw new Error('Telegram authentication failed')
        }

        // Return user object with minimal properties for session
        return { id: authData.id, name: authData.first_name, image: authData.photo_url, credentials }
      },
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
          case 'telegram':
            token.telegram = {
              account,
            }
            break
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
