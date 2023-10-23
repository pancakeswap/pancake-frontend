import { Game, CarouselDataType } from '../../types'

export const example: Game = {
  id: 'example',
  projectName: 'Binary',
  title: 'Pancake Protectors',
  subTitle: 'Unlock the Power of CAKE and Perks for Pancake Squad and Bunnies Holders',
  description:
    'PancakeSwap and Mobox joined forces to launch a tower-defense and PvP game tailored for GameFi players, as well as CAKE, Pancake Squad, and Bunnies holders.',
  publishDate: 1698044972,
  isHorizontal: true,
  headerImageUrl: 'https://pancakeswap.finance/images/ifos/sable-bg.png',
  projectLogoUrl: 'https://pancakeswap.finance/images/ifos/sable-bg.png',
  gameLink: 'https://protectors.pancakeswap.finance/',
  carouselData: [
    {
      type: CarouselDataType.Image,
      imageUrl:
        'https://cdn.akamai.steamstatic.com/steam/apps/578080/ss_4454f310776c626a76baeca2d05fd82bd17c6ee0.600x338.jpg?t=1694608943',
    },
    {
      type: CarouselDataType.Video,
      imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/256962886/movie.293x165.jpg?t=1691652642',
      videoUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/256962886/movie480_vp9.webm?t=1691652642',
    },
    {
      type: CarouselDataType.Video,
      imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/256957737/movie.293x165.jpg?t=1689138251',
      videoUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/256957737/movie480_vp9.webm?t=1689138251',
    },
    {
      type: CarouselDataType.Video,
      imageUrl:
        'https://cdn.akamai.steamstatic.com/steam/apps/578080/ss_108e2981889423b057b778cd07ae25ac18406cf1.1920x1080.jpg?t=1694608943',
    },
  ],
  youtubeVideo: [
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
    telegramUrl: 'https://t.me/pancakeswap',
    discordUrl: 'https://discord.com/invite/pancakeswap',
  },
}
