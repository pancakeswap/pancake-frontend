export interface PlayListData {
  title: string
  videoId: string // Youtube Video Id
}

export enum PostersItemDataType {
  Image = 'image',
  Video = 'video',
}

export interface PostersItemData {
  type: PostersItemDataType
  image: string
  video?: string
}

export enum PostersLayout {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export interface GameType {
  id: string
  projectName: string
  title: string
  subTitle: string
  description: string
  publishDate: number // timestamp in seconds
  headerImage: string
  projectLogo: string
  gameLink: string
  posters: {
    layout: PostersLayout
    items: PostersItemData[] // Minimum requirements 4
  }
  playList: PlayListData[] // Minimum requirements 4
  socialMedia: {
    telegram?: string
    discord?: string
  }
}
