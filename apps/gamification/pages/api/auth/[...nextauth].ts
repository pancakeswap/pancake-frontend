import { AuthDataValidator } from '@telegram-auth/server'
import { objectToAuthDataMap } from '@telegram-auth/server/utils'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import DiscordProvider from 'next-auth/providers/discord'

const TelegramProvider = CredentialsProvider({
  id: 'telegram-login',
  name: 'Telegram Login',
  credentials: {},
  async authorize(credentials, req) {
    const validator = new AuthDataValidator({ botToken: `${process.env.BOT_TOKEN}` })

    const data = objectToAuthDataMap(req.query || {})

    const user = await validator.validate(data)

    if (user.id && user.first_name) {
      return {
        id: user.id.toString(),
        name: [user.first_name, user.last_name || ''].join(' '),
        image: user.photo_url,
      }
    }

    return null
  },
})

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
    TelegramProvider,
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
    // async redirect({ url, baseUrl }) {
    // return url
    // return `${baseUrl}/profile`
    // },
  },
})
