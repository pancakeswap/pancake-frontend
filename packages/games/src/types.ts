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
    items: PostersItemData[]
  }
  playlist: PlaylistData[]
  socialMedia: {
    telegram?: string
    discord?: string
  }
}
