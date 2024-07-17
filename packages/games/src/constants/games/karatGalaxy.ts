import { GameType, GenreType, PostersItemDataType, PostersLayout, TrendingTagType } from '../../types'

export const karatGalaxy: GameType = { 
  id: 'karat-galaxy', 
  projectName: 'Karat', 
  title: 'Karat Galaxy', 
  subTitle: 'Embark on a Cosmic Karat Quest: Shoot, mine, win!', 
  description: 'Join an interstellar adventure where mining, NFTs, DeFi, and fun unite.  Power up with KARAT and turn CAKE tokens into gold coins, unlocking exciting in-game adventures. Enjoy exclusive bonuses with Pancake Squad and Bunny NFTs. Battle, mine, win, and conquer the cosmos.', 
  publishDate: 1698044972, // Timestamp in seconds 
 genre: GenreType.TowerDefense, 
 trendingTags: [ 
    TrendingTagType.Strategy 
 ],
 // 1600px x 224px  
 headerImage: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/header.jpg',
 headerIconImage: { 
  // 716px × 290px 
    desktop: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/header-icon.png',
  // 215px × 174px 
    mobile: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/header-icon.png'
  }, 
  projectLogo: { 
  // 153px × 55px 
    lightTheme: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/logo.svg', 
  // 153px × 55px 
    darkTheme: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/logo.svg', 
  }, 
  projectCircleLogo: { 
  // 120px × 120px 
    lightTheme: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/circle-logo.png',
    // 120px × 120px 
	darkTheme: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/circle-logo.png',
  }, 
  gameLink: 'https://statics.karatgalaxy.io/', 
  posters: { 
    layout: PostersLayout.Horizontal, 
  // Layout horizontal ->  Recommend image size 1200px × 674px 
  // Layout vertical -> Recommend image size 760px x 1360px 
  // Video format mp4 / webm 
    items: [ 
      { 
        type: PostersItemDataType.Video, 
        image: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/movie_v1.png',
        video: 'https://statics.karatgalaxy.io/pancakeswap-game-landing/movie.mp4', // format mp4 / webm 
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
    telegram: 'https://t.me/PancakeSwap/',
    discord: 'https://discord.gg/pancakeswap', 
  }, 
}



