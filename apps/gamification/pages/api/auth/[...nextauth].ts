import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import TwitterProvider from 'next-auth/providers/twitter'

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY ?? '',
      clientSecret: process.env.TWITTER_CONSUMER_SECRET ?? '',
    }),
  ],
  // pages: {
  //   signIn: '/profile',
  // },
  callbacks: {
    async jwt({ token, account, profile }: any) {
      // Initial sign-in
      if (account && profile) {
        // eslint-disable-next-line default-case
        switch (account.provider) {
          case 'discord':
            // eslint-disable-next-line no-param-reassign
            token.discordId = profile.id
            break
          case 'twitter':
            // eslint-disable-next-line no-param-reassign
            token.twitterId = profile.id
            break
        }
      }
      return token
    },
    async session({ session, token }) {
      // eslint-disable-next-line no-param-reassign
      ;(session as any).user.discordId = token.discordId || null
      // eslint-disable-next-line no-param-reassign
      ;(session as any).user.twitterId = token.twitterId || null
      return session
    },
    // async redirect({ url, baseUrl }) {
    //   return url
    //   // return `${baseUrl}/profile`
    // },
  },
})
