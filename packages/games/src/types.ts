export interface Game {
  name: string
  description: string
  isHorizontal: boolean
  socialMedia: {
    telegramUrl: string
    discordUrl: string
  }
}
