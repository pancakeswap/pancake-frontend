import { getArticle } from '@pancakeswap/blog'
import { useQuery } from '@tanstack/react-query'
import { AllArticleType } from 'views/LandingV4/config/types'
import { staticThirdPartyNews } from '../config/blog/staticThirdPartyNews'

const LIMIT = 50
const FEATURED_IDS = [2505, 2506, 2509]

export const useV4Featured = (): AllArticleType => {
  const { data: articlesData, isPending } = useQuery({
    queryKey: ['/featured-v4-articles'],

    queryFn: async () => {
      const response = await getArticle({
        url: '/articles',
        urlParamsObject: {
          populate: 'categories,image',
          sort: 'createAt:desc',
          filters: {
            id: {
              $in: FEATURED_IDS,
            },
          },
        },
      })

      const data = response.data.sort((a, b) => {
        const indexA = FEATURED_IDS.indexOf(a.id)
        const indexB = FEATURED_IDS.indexOf(b.id)

        if (indexA === -1) return 1
        if (indexB === -1) return -1

        return indexA - indexB
      })

      return {
        ...response,
        data,
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return {
    isFetching: isPending,
    articlesData: articlesData ?? {
      data: [],
      pagination: {
        page: 0,
        pageSize: 0,
        pageCount: 0,
        total: 0,
      },
    },
  }
}

export const useV4Articles = (): AllArticleType => {
  const { data: articlesData, isPending } = useQuery({
    queryKey: ['/latest-v4-articles'],

    queryFn: async () =>
      getArticle({
        url: '/articles',
        urlParamsObject: {
          populate: 'categories,image',
          sort: 'createAt:desc',
          pagination: { limit: LIMIT },
          filters: {
            $and: [
              {
                newsOutBoundLink: {
                  $null: true,
                },
              },
              {
                categories: {
                  name: {
                    $eq: 'V4',
                  },
                },
              },
            ],
          },
        },
      }),

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return {
    isFetching: isPending,
    articlesData: articlesData ?? {
      data: [],
      pagination: {
        page: 0,
        pageSize: 0,
        pageCount: 0,
        total: 0,
      },
    },
  }
}

export const useV4NewsArticle = (): AllArticleType => {
  const { data: articlesData, isPending } = useQuery({
    queryKey: ['/v4-news'],

    queryFn: async () => {
      const response = await getArticle({
        url: '/articles',
        urlParamsObject: {
          populate: 'categories,image',
          sort: 'createAt:desc',
          filters: {
            $and: [
              {
                categories: {
                  name: {
                    $eq: 'News',
                  },
                },
              },
              {
                categories: {
                  name: {
                    $eq: 'V4',
                  },
                },
              },
            ],
          },
          pagination: { limit: LIMIT },
        },
      })

      return {
        ...response,
        data: [...response.data, ...staticThirdPartyNews],
      }
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return {
    isFetching: isPending,
    articlesData: articlesData ?? {
      data: [],
      pagination: {
        page: 0,
        pageSize: 0,
        pageCount: 0,
        total: 0,
      },
    },
  }
}
