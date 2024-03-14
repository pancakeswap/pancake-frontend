import { GameType, GenreType, PostersItemDataType, PostersLayout, TrendingTagType } from '../../types'

export const pancakeProtectors: GameType = {
  id: 'pancake-protectors',
  projectName: 'Mobox',
  title: 'Pancake Protector',
  subTitle: 'Unlock the Power of CAKE and Perks for Pancake Squad and Bunnies Holders',
  description:
    'PancakeSwap and Mobox joined forces to launch a tower-defense and PvP game tailored for GameFi players, as well as CAKE, Pancake Squad, and Bunnies holders.',
  publishDate: 1698044972,
  genre: GenreType.TowerDefense,
  trendingTags: [
    TrendingTagType.Strategy,
    TrendingTagType.PancakeSquadNFT,
    TrendingTagType.PancakeBunniesNFT,
    TrendingTagType.TowerDefense,
    TrendingTagType.Multiplayer,
    TrendingTagType.CakeToken,
  ],
  headerImage: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/header.jpeg',
  headerIconImage: {
    desktop: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/desktop-header-icon.png',
    mobile: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/mobile-header-icon.png',
  },
  projectLogo: {
    lightTheme: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/project-logo-light-theme.png',
    darkTheme: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/project-logo-dark-theme.png',
  },
  projectCircleLogo: {
    lightTheme: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/mobox-circle-logo.png',
    darkTheme: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/mobox-circle-logo.png',
  },
  gameLink: {
    playNowLink: 'https://pancakeprotectors.io/',
  },
  posters: {
    layout: PostersLayout.Vertical,
    items: [
      {
        type: PostersItemDataType.Video,
        video: 'https://www.mobox.io/download/Pancake_Protectors_Video.mp4',
        image: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/5.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/1.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/2.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/3.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://pancakeprotectors.io/assets/pancakeswap-game-landing/4.png',
      },
    ],
  },
  playlist: [
    {
      videoId: '80j7QpNqKcI',
      title: 'Unleashing the Power of Pancake Protectors: A Web3 Gaming Adventure on PancakeSwap',
    },
    {
      videoId: '--UcFQ64sjY',
      title: 'Pancake Protectors is here! Discover the power of CAKE and perks for Pancake Squads and Bunnies',
    },
    {
      videoId: '-KViZLhrVE4',
      title: 'Pancake Protectors 2 Minute Guide For BEGINNERS | EP 4 Using CAKE in the game',
    },
    {
      videoId: '0L8bPhzT-xU',
      title: 'Pancake Protectors is here! Discover the power of CAKE and perks for Pancake Squads and Bunnies',
    },
    {
      videoId: '3gbxF8-eBAg',
      title: 'Pancake Protectors Explained in 2 Minutes For BEGINNERS | EP 1: From Connection to Conquest',
    },
    {
      videoId: 'w72vcEV1pcE',
      title: 'Pancake Protectors Explained in 2 Minutes For BEGINNERS | EP 1.1: From Connection to Conquest',
    },
  ],
  socialMedia: {
    telegram: 'https://t.me/PancakeSwap/2991960',
    discord: 'https://discord.gg/pancakeswap',
  },
}
