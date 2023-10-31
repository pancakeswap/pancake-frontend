import { GameType, PostersLayout, PostersItemDataType } from '../../types'

export const pancakeProtectors: GameType = {
  id: 'pancake-protectors',
  projectName: 'Mobox',
  title: 'Pancake Protector',
  subTitle: 'Unlock the Power of CAKE and Perks for Pancake Squad and Bunnies Holders',
  description:
    'Immerse yourself in the exhilarating world of Pancake Protector with this meticulously crafted collection of NFTs. Designed exclusively for the game, these NFTs bestow extraordinary attribute bonuses upon your heroes, elevating their capabilities to unmatched heights. Step into the realm of epic battles and heroic quests as you wield the power of these remarkable artefact. But that’s not all - the Exclusive Fashion NFTs unlock captivating and exclusive visual transformations, ensuring your designated heroes stand out in style. Prepare for an unforgettable adventure and unleash the full potential of these extraordinary NFTs in your quest to become a true champion of Pancake Protector!',
  publishDate: 1698044972,
  headerImage: '/images/game/example-header.jpeg',
  headerIconImage: {
    desktop: '/images/game/example-desktop-header-icon.png',
    mobile: '/images/game/example-mobile-header-icon.png',
  },
  projectLogo: {
    lightTheme: 'https://pancakeswap.finance/images/ifos/sable-bg.png',
    darkTheme: 'https://pancakeswap.finance/images/ifos/sable-bg.png',
  },
  projectCircleLogo: {
    lightTheme: 'https://pancakeswap.finance/images/ifos/sable-bg.png',
    darkTheme: 'https://pancakeswap.finance/images/ifos/sable-bg.png',
  },
  gameLink: 'https://protectors.pancakeswap.finance/',
  posters: {
    layout: PostersLayout.Horizontal,
    items: [
      {
        type: PostersItemDataType.Image,
        image:
          'https://cdn.akamai.steamstatic.com/steam/apps/578080/ss_4454f310776c626a76baeca2d05fd82bd17c6ee0.600x338.jpg?t=1694608943',
      },
    ],
  },
  playlist: [
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
  ],
  socialMedia: {
    telegram: 'https://t.me/pancakeswap',
    discord: 'https://discord.com/invite/pancakeswap',
  },
}
