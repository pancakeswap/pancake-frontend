import { AllArticleType, getArticle } from '@pancakeswap/blog'
import { useQuery } from '@tanstack/react-query'

export const useAllNewsArticle = (): AllArticleType => {
  const { data: articlesData, isPending } = useQuery({
    queryKey: ['/allNews'],

    queryFn: async () =>
      getArticle({
        url: '/articles',
        urlParamsObject: {
          populate: 'categories,image',
          sort: 'createAt:desc',
          pagination: { limit: 9 },
          filters: {
            categories: {
              name: {
                $eq: 'News',
              },
            },
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

export const useLatestArticle = (): AllArticleType => {
  const { data: articlesData, isPending } = useQuery({
    queryKey: ['/latestArticle'],

    queryFn: () =>
      getArticle({
        url: '/articles',
        urlParamsObject: {
          populate: 'categories,image',
          sort: 'createAt:desc',
          pagination: { limit: 1 },
        },
      }),

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
