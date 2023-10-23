export interface YoutubeData {
  title: string
  videoId: string
}

export enum CarouselDataType {
  Image = 'image',
  Video = 'video',
}

export interface CarouselData {
  type: CarouselDataType
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
  carouselData: CarouselData[] // Minimum requirements 4
  youtubeVideo: YoutubeData[] // Minimum requirements 4
  socialMedia: {
    telegramUrl?: string
    discordUrl?: string
  }
}
