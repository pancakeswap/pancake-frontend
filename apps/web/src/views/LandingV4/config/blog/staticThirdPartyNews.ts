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
  {
    id: -2,
    title: 'ETHBrussels',
    description:
      'PancakeSwap is the official partner of ETHGlobal Brussel 2024, hosting a hackathon with $20,000 in prizes.',
    createAt: '2024-07-1',
    categories: [],
    content: '',
    gamesCategories: [],
    imgUrl: `${ASSET_CDN}/web/v4-landing/ethbrussels-thumbnail.jpeg`,
    locale: 'en',
    newsFromPlatform: 'ETHGlobal',
    newsOutBoundLink: 'https://ethglobal.com/events/brussels/prizes/pancakeswap',
    publishedAt: '2024-07-01T04:23:22.553Z',
    slug: 'eth-global-brussels',
    location: 'Brussels, Belgium',
    eventStartToEndTime: '12 July 2024 - 14 July 2024',
  },
]
