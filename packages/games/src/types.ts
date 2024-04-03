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

export enum GenreType {
  TowerDefense = 'Tower Defense',
  Casual = 'Casual',
  FPS = 'First Person Shooter',
  MMORPG = 'MMORPG',
}

export enum TrendingTagType {
  Strategy = 'Strategy',
  PancakeSquadNFT = 'PancakeSquad NFT',
  PancakeBunniesNFT = 'Pancake Bunnies NFT',
  TowerDefense = 'Tower Defense',
  Multiplayer = 'Multiplayer',
  CakeToken = 'CAKE token',
  BaseBuilding = 'Base Building',
  NFT = 'NFT',
  FPS = 'First Person Shooter',
  Windows = 'Windows',
  MMORPG = 'Massive Multiplayer Online Role-Playing Game',
}

export type Article = {
  title: string
  link: string
}

export interface GameLinkType {
  external?: boolean
  signUpLink?: string
  playNowLink: string
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
  gameLink: GameLinkType
  posters: {
    layout: PostersLayout
    items: PostersItemData[]
  }
  playlist: PlaylistData[]
  socialMedia: {
    telegram?: string
    discord?: string
  }
  genre: GenreType
  trendingTags: TrendingTagType[]
  articles?: Article[]
}
