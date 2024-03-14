import { ASSET_CDN } from 'config/constants/endpoints'
import { V4ArticleDataType } from 'views/LandingV4/config/types'

export const staticThirdPartyNews: V4ArticleDataType[] = [
  {
    id: -1,
    title: 'ETHGlobal London',
    description:
      'PancakeSwap is the official partner of ETHGlobal London 2024. Hosting our first-ever hackathon featuring a $10,000 prize pool, where developers can showcase their creativity by building innovative hooks and win rewards.',
    createAt: '2024-03-15',
    categories: [],
    content: '',
    gamesCategories: [],
    imgUrl: `${ASSET_CDN}/web/v4-landing/ethglobal-thumbnail.jpeg`,
    locale: 'en',
    newsFromPlatform: 'ETHGlobal',
    newsOutBoundLink: 'https://ethglobal.com/events/london2024/prizes/pancakeswap',
    publishedAt: '2024-03-15T08:18:42.595Z',
    slug: 'eth-global-london',
    location: 'London, UK',
    eventStartToEndTime: '15 Mar 2024 - 17 Mar 2024',
  },
]
