import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
  ],
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
          // case 'telegram':
          //   // eslint-disable-next-line no-param-reassign
          //   token.telegramId = profile.id
          //   break
        }
      }
      return token
    },
    async session({ session, token }) {
      // eslint-disable-next-line no-param-reassign
      ;(session as any).user.discordId = token.discordId || null
      // eslint-disable-next-line no-param-reassign
      // ;(session as any).user.telegramId = token.telegramId || null
      return session
    },
    async redirect({ url, baseUrl }) {
      return url
      // return `${baseUrl}/profile`
    },
  },
})
