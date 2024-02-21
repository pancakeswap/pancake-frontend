import { GameType, GenreType, PostersItemDataType, PostersLayout, TrendingTagType } from '../../types'

export const binaryX: GameType = {
  id: 'binary-x',
  projectName: 'BinaryX',
  title: 'Pancake Mayor',
  subTitle: 'Bringing The World To BinaryX',
  description:
    'BinaryX aims to introduce high quality games to Web3 and the metaverse. We develop our own games such as CyberChess and CyberLand. We are constantly re-assessing and optimising the tokenomic models of our games to provide a good gaming experience for our users.',
  publishDate: 1698044972,
  genre: GenreType.Casual,
  trendingTags: [
    TrendingTagType.Strategy,
    TrendingTagType.PancakeSquadNFT,
    TrendingTagType.PancakeBunniesNFT,
    TrendingTagType.BaseBuilding,
    TrendingTagType.Multiplayer,
    TrendingTagType.CakeToken,
  ],
  headerImage:
    'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/8c50cf73-3fb4-442b-af79-af83e35f48523500085818638126305.jpg',
  projectLogo: {
    lightTheme:
      'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/777856ff-3b9b-47de-a0f6-ed12549039548953842897533356367.png',
    darkTheme:
      'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/efc0b9bc-e7ad-429d-8cc3-a33f2e2aab5e3024234021282114322.png',
  },
  projectCircleLogo: {
    lightTheme:
      'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/109cebd1-5c08-49c8-8435-a7eb4ba8cec34355819590091347704.png',
    darkTheme:
      'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/109cebd1-5c08-49c8-8435-a7eb4ba8cec34355819590091347704.png',
  },
  gameLink: {
    playNowLink: 'https://play.cryptomayor.xyz/pancake/index.html',
  },
  posters: {
    layout: PostersLayout.Horizontal,
    items: [
      {
        type: PostersItemDataType.Video,
        video:
          'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/be68f742-9e64-4f96-a122-2fef7b7241018211824303495483334.mp4',
        image:
          'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/621ce15f-939f-4bd4-8a9a-77ac0c56cc246370433273485047752.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image:
          'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/b74c59d2-54c8-41ba-8b1b-3008b2ad19ae8349367803394893783.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image:
          'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/49c27ed6-317c-4b25-b3f2-9a10f93986915999576708869779667.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image:
          'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/ae4ce6b4-a583-468c-b1b1-353f152da1d82212557744164858657.jpg',
      },
      {
        type: PostersItemDataType.Image,
        image:
          'https://s3.ap-northeast-1.amazonaws.com/binaryx-game/t-temp/1b38cad0-805b-4fcf-8dcd-fa48e1b527d98858633642766468183.jpg',
      },
    ],
  },
  playlist: [],
  socialMedia: {
    telegram: 'https://t.me/binaryxGlobal',
    discord: 'https://discord.com/invite/binaryx',
  },
  articles: [
    {
      title: 'Introduction to Pancake Mayor',
      link: 'https://binary-x.medium.com/introduction-to-pancake-mayor-binaryxs-newest-hyper-game-764173a4c56b',
    },
    {
      title: 'Pancake Mayor Wiki',
      link: 'https://lightning-mole-a4a.notion.site/Pancake-Mayor-Wiki-d60046e1b95d433196e51cbb716eef28',
    },
  ],
}
