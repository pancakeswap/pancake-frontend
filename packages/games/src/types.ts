export interface PlaylistData {
  title: string
  videoId: string // Youtube Video Id
}

export enum PostersItemDataType {
  Image = 'image',
  Video = 'video',
}

export interface PostersItemData {
  type: PostersItemDataType
  imageUrl: string
  videoUrl?: string
}

export enum PostersLayout {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export interface Game {
  id: string
  projectName: string
  title: string
  subTitle: string
  description: string
  publishDate: number // timestamp in seconds
  headerImageUrl: string
  projectLogoUrl: string
  gameLink: string
  posters: {
    layout: PostersLayout
    items: PostersItemData[] // Minimum requirements 4
  }
  playlist: PlaylistData[] // Minimum requirements 4
  socialMedia: {
    telegramUrl?: string
    discordUrl?: string
  }
}
