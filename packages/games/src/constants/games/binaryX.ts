import { GameType, PostersLayout, PostersItemDataType } from '../../types'

export const binaryX: GameType = {
  id: 'binary-x',
  projectName: 'BinaryX',
  title: 'Pancake Mayor',
  subTitle: 'Bringing The World To BinaryX',
  description:
    'BinaryX aims to introduce high quality games to Web3 and the metaverse. We develop our own games such as CyberChess and CyberLand. We are constantly re-assessing and optimising the tokenomic models of our games to provide a good gaming experience for our users.',
  publishDate: 1698044972,
  headerImage: 'https://pancakeswap.finance/images/ifos/sable-bg.png',
  projectLogo: {
    lightTheme: 'https://www.binaryx.pro/_next/static/media/logo.88362623.svg',
    darkTheme: 'https://www.binaryx.pro/_next/static/media/logo.88362623.svg',
  },
  projectCircleLogo: {
    lightTheme: 'https://pbs.twimg.com/profile_images/1610142710194925569/RqJfmXQV_400x400.jpg',
    darkTheme: 'https://pbs.twimg.com/profile_images/1610142710194925569/RqJfmXQV_400x400.jpg',
  },
  gameLink: 'https://play.cryptomayor.xyz/pancake/index.html',
  posters: {
    layout: PostersLayout.Horizontal,
    items: [
      {
        type: PostersItemDataType.Image,
        image:
          'https://www.binaryx.pro/_next/image?url=https%3A%2F%2Fs3.ap-northeast-1.amazonaws.com%2Fbinaryx-game%2Fbinaryx-web-dev%2Fc0324b41-1a5c-4b22-988d-6b0f4db8b1581271817841257595350.jpg&w=3840&q=75',
      },
      {
        type: PostersItemDataType.Image,
        image:
          'https://www.binaryx.pro/_next/image?url=https%3A%2F%2Fs3.ap-northeast-1.amazonaws.com%2Fbinaryx-game%2Fbinaryx-web-dev%2F6d97436c-3240-474d-960b-61204517a4e84162343369575143256.jpg&w=3840&q=75',
      },
      {
        type: PostersItemDataType.Image,
        image:
          'https://www.binaryx.pro/_next/image?url=https%3A%2F%2Fs3.ap-northeast-1.amazonaws.com%2Fbinaryx-game%2Fbinaryx-web-dev%2F9823828c-2168-4bfb-97fe-0e430663931c2391024833674775783.png&w=3840&q=75',
      },
      {
        type: PostersItemDataType.Image,
        image:
          'https://www.binaryx.pro/_next/image?url=https%3A%2F%2Fs3.ap-northeast-1.amazonaws.com%2Fbinaryx-game%2Fbinaryx-web-dev%2F528f2c74-e981-412e-a7a8-63117969a420987032063527451128.png&w=3840&q=75',
      },
    ],
  },
  playlist: [
    // {
    //   videoId: '--UcFQ64sjY',
    //   title: 'Pancake Protectors is here! Discover the power of CAKE and perks for Pancake Squads and Bunnies',
    // },
    // {
    //   videoId: '-KViZLhrVE4',
    //   title: 'Pancake Protectors 2 Minute Guide For BEGINNERS | EP 4 Using CAKE in the game',
    // },
    // {
    //   videoId: '0L8bPhzT-xU',
    //   title: 'Pancake Protectors is here! Discover the power of CAKE and perks for Pancake Squads and Bunnies',
    // },
    // {
    //   videoId: '3gbxF8-eBAg',
    //   title: 'Pancake Protectors Explained in 2 Minutes For BEGINNERS | EP 1: From Connection to Conquest',
    // },
  ],
  socialMedia: {
    telegram: 'https://t.me/binaryxGlobal',
    discord: 'https://discord.com/invite/binaryx',
  },
}
