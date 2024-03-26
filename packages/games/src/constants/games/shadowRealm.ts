import { GameType, GenreType, PostersItemDataType, PostersLayout, TrendingTagType } from '../../types'

export const shadowRealm: GameType = {
  id: 'shadow-realm',
  projectName: 'ChainzStudios',
  title: 'Shadow Realm',
  subTitle: 'Put your CAKE and Pancake NFTS to the test in this 3D Action-RPG',
  description: `Join "Shadow Realms, Chainz Studios" RPG on PancakeSwap. Battle the Zerg, explore Dragon Cry, and become the ultimate Awakener. Your adventure starts now.`,
  publishDate: 1711612800,
  genre: GenreType.MMORPG,
  trendingTags: [
    TrendingTagType.MMORPG,
    TrendingTagType.Strategy,
    TrendingTagType.PancakeSquadNFT,
    TrendingTagType.PancakeBunniesNFT,
    TrendingTagType.Multiplayer,
    TrendingTagType.CakeToken,
  ],
  headerImage: 'https://shadow-realm.chainzstudios.com/overview/header.png',
  headerIconImage: {
    desktop: 'https://shadow-realm.chainzstudios.com/overview/headerIcon.png',
    mobile: 'https://shadow-realm.chainzstudios.com/overview/headerIcon.png',
  },
  projectLogo: {
    lightTheme: 'https://shadow-realm.chainzstudios.com/overview/logo.png',
    darkTheme: 'https://shadow-realm.chainzstudios.com/overview/logo.png',
  },
  projectCircleLogo: {
    lightTheme: 'https://shadow-realm.chainzstudios.com/overview/logo-circle.png',
    darkTheme: 'https://shadow-realm.chainzstudios.com/overview/logo-circle.png',
  },
  gameLink: {
    playNowLink: 'https://www.chainzstudios.com/shadow-realms/',
  },
  posters: {
    layout: PostersLayout.Horizontal,
    items: [
      {
        type: PostersItemDataType.Video,
        video: 'https://shadow-realm.chainzstudios.com/overview/shadow_realms.mp4',
        image: 'https://shadow-realm.chainzstudios.com/overview/vd.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://shadow-realm.chainzstudios.com/overview/1.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://shadow-realm.chainzstudios.com/overview/2.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://shadow-realm.chainzstudios.com/overview/3.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://shadow-realm.chainzstudios.com/overview/4.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://shadow-realm.chainzstudios.com/overview/5.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://shadow-realm.chainzstudios.com/overview/6.jpg',
      },
    ],
  },
  playlist: [],
  socialMedia: {
    telegram: 'https://t.me/PancakeSwap/',
    discord: 'https://discord.gg/pancakeswap',
  },
}
