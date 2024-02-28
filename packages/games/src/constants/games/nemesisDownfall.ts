import { GameType, GenreType, PostersItemDataType, PostersLayout, TrendingTagType } from '../../types'

export const nemesisDownfall: GameType = {
  id: 'Nemesis-Downfall',
  projectName: 'Nemesis Labs',
  title: 'Nemesis Downfall',
  subTitle: 'Dive into the intense firefights of Nemesis Downfall',
  description:
    'In the unforgiving arenas of Nemesis Downfall, only the sharpest survive. Do you have what it takes to emerge victorious?',
  publishDate: 1708617600,
  genre: GenreType.FPS,
  trendingTags: [
    TrendingTagType.FPS,
    TrendingTagType.Multiplayer,
    TrendingTagType.CakeToken,
    TrendingTagType.Windows,
    TrendingTagType.NFT,
    TrendingTagType.PancakeSquadNFT,
    TrendingTagType.PancakeBunniesNFT,
  ],
  headerImage: 'https://ndpcs.s3.amazonaws.com/Banner.png',
  headerIconImage: {
    desktop: 'https://ndpcs.s3.amazonaws.com/Header+icon+image+desktop.png',
    mobile: 'https://ndpcs.s3.amazonaws.com/Header+icon+image+mobile.png',
  },
  projectLogo: {
    lightTheme: 'https://ndpcs.s3.amazonaws.com/Project+logotype+light+background.png',
    darkTheme: 'https://ndpcs.s3.amazonaws.com/Project+logotype+dark+background.png',
  },
  projectCircleLogo: {
    lightTheme: 'https://ndpcs.s3.amazonaws.com/Project+logotype+circle.png',
    darkTheme: 'https://ndpcs.s3.amazonaws.com/Project+logotype+circle.png',
  },
  gameLink: {
    external: true,
    signUpLink:
      'https://auth.nemesisdownfall.com/login?client_id=60sha7m7ote2m6ipotns8kdr9b&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fnemesisdownfall.com%2Fsuccessful%2F',
    playNowLink:
      'https://auth.nemesisdownfall.com/login?client_id=60sha7m7ote2m6ipotns8kdr9b&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fnemesisdownfall.com%2Fsuccessful%2F',
  },
  posters: {
    layout: PostersLayout.Horizontal,
    items: [
      {
        type: PostersItemDataType.Video,
        image: 'https://ndpcs.s3.amazonaws.com/Poster+1.png',
        video: 'https://ndpcs.s3.amazonaws.com/Nemesis+Downfall+-+Main+Trailer.mp4',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://ndpcs.s3.amazonaws.com/Poster+2.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://ndpcs.s3.amazonaws.com/Poster+3.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://ndpcs.s3.amazonaws.com/Poster+4.png',
      },
      {
        type: PostersItemDataType.Image,
        image: 'https://ndpcs.s3.amazonaws.com/Poster+5.png',
      },
    ],
  },
  playlist: [
    {
      videoId: '2BwmbNxa-qw',
      title: 'Visit our first map, the WAIF military complex',
    },
    {
      videoId: 'HKC74K154hI',
      title: 'Nemesis Downfall is having constant new updates. Watch our previous trailers!',
    },
  ],
  socialMedia: {
    telegram: 'https://t.me/PancakeSwap/3340271',
    discord: 'https://discord.com/channels/897834609272840232/1209684050370105434',
  },
}
