import { GameType, GenreType, PostersItemDataType, PostersLayout, TrendingTagType } from '../../types'

export const karatGalaxy: GameType = {
  id: 'karat-galaxy',
  projectName: 'Karat',
  title: 'Karat Galaxy',
  subTitle: 'Embark on a Cosmic Karat Quest: Shoot, mine, win!',
  description:
    'Join an interstellar adventure where mining, NFTs, DeFi, and fun unite.  Power up with KARAT and turn CAKE tokens into gold coins, unlocking exciting in-game adventures. Enjoy exclusive bonuses with Pancake Squad and Bunny NFTs. Battle, mine, win, and conquer the cosmos.',
  publishDate: 1698044972, // Timestamp in seconds
  genre: GenreType.FPS,
  trendingTags: [
    TrendingTagType.FPS,
    TrendingTagType.NFT,
    TrendingTagType.PancakeSquadNFT,
    TrendingTagType.PancakeBunniesNFT,
    TrendingTagType.Multiplayer,
    TrendingTagType.CakeToken,
  ],
  headerImage: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/header.jpg',
  headerIconImage: {
    desktop: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/header-icon.png',
    mobile: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/header-icon.png',
  },
  projectLogo: {
    lightTheme: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/logo.svg',
    darkTheme: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/logo.svg',
  },
  projectCircleLogo: {
    lightTheme: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/circle-logo.png',
    darkTheme: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/circle-logo.png',
  },
  gameLink: {
    playNowLink: 'https://statics.karatgalaxy.io/',
  },
  posters: {
    layout: PostersLayout.Horizontal,
    items: [
      {
        type: PostersItemDataType.Video,
        image: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/movie_v1.png',
        video: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/movie.mp4',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/1.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/2.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/3.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/4.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/5.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/6.png',
      },
    ],
  },
  playlist: [],
  socialMedia: {
    telegram: 'https://t.me/PancakeSwap/3466527',
    discord: 'https://discord.gg/UtgWsTqu',
  },
}
