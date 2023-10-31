import { GameType, PostersLayout, PostersItemDataType } from '../../types'

export const binaryX: GameType = {
  id: 'binary-x',
  projectName: 'BinaryX',
  title: 'Pancake Mayor',
  subTitle: 'Bringing The World To BinaryX',
  description:
    'BinaryX aims to introduce high quality games to Web3 and the metaverse. We develop our own games such as CyberChess and CyberLand. We are constantly re-assessing and optimising the tokenomic models of our games to provide a good gaming experience for our users.',
  publishDate: 1698044972,
  headerImage: '/images/game/binaryx/header.jpg',
  projectLogo: {
    lightTheme: '/images/game/binaryx/project-logo-light-theme.png',
    darkTheme: '/images/game/binaryx/project-logo-dark-theme.png',
  },
  projectCircleLogo: {
    lightTheme: '/images/game/binaryx/project-circle.png',
    darkTheme: '/images/game/binaryx/project-circle.png',
  },
  gameLink: 'https://play.cryptomayor.xyz/pancake/index.html',
  posters: {
    layout: PostersLayout.Horizontal,
    items: [
      {
        type: PostersItemDataType.Image,
        image: '/images/game/binaryx/posters-1.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image: '/images/game/binaryx/posters-2.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image: '/images/game/binaryx/posters-3.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image: '/images/game/binaryx/posters-4.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image: '/images/game/binaryx/posters-5.jpg',
      },
    ],
  },
  playlist: [],
  socialMedia: {
    telegram: 'https://t.me/binaryxGlobal',
    discord: 'https://discord.com/invite/binaryx',
  },
}
