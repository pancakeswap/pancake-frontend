import { useQuery } from '@tanstack/react-query'
import { getArticle } from './getArticle'
import { ArticleType } from '../utils/transformArticle'

interface AllArticleType {
  isFetching: boolean
  articlesData: ArticleType
}

export const useAllNewsArticle = (): AllArticleType => {
  const { data: articlesData, isLoading } = useQuery(
    ['/allNews'],
    async () =>
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
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  return {
    isFetching: isLoading,
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
  const { data: articlesData, isLoading } = useQuery(
    ['/latestArticle'],
    () =>
      getArticle({
        url: '/articles',
        urlParamsObject: {
          populate: 'categories,image',
          sort: 'createAt:desc',
          pagination: { limit: 1 },
        },
      }),
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  return {
    isFetching: isLoading,
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
