import { ASSET_CDN } from 'config/constants/endpoints'
import { V4ArticleDataType } from 'views/LandingV4/config/types'

export const staticThirdPartyNews: V4ArticleDataType[] = [
  {
    id: -1,
    title: 'ETHGlobal London',
    description:
      'PancakeSwap is a leading multichain decentralized exchange that operates on an automated market maker (AMM) model.Launched in 2020, Pancakeswap is one of the most popular DEXs in the cryptocurrency industry due to its low transaction fees',
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
