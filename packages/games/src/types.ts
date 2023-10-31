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
  video?: string // format mp4 / webm
}

export enum PostersLayout {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export interface Logo {
  lightTheme: string
  darkTheme: string
}

export interface GameType {
  id: string
  projectName: string
  title: string
  subTitle: string
  description: string
  publishDate: number // timestamp in seconds
  headerImage: string
  headerIconImage?: {
    desktop: string
    mobile: string
  }
  projectLogo: Logo
  projectCircleLogo: Logo
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
