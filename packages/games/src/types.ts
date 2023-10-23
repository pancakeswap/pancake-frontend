export interface PlaylistData {
  title: string
  videoId: string // youtube Id
}

export enum PostersDataType {
  Image = 'image',
  Video = 'video',
}

export interface PostersData {
  type: PostersDataType
  imageUrl: string
  videoUrl?: string
}

export interface Game {
  id: string
  projectName: string
  title: string
  subTitle: string
  description: string
  publishDate: number // timestamp in seconds
  isHorizontal: boolean
  headerImageUrl: string
  projectLogoUrl: string
  gameLink: string
  posters: PostersData[] // Minimum requirements 4
  playlist: PlaylistData[] // Minimum requirements 4
  socialMedia: {
    telegramUrl?: string
    discordUrl?: string
  }
}
