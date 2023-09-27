import useSWR from 'swr'
import { ArticleType } from '../utils/transformArticle'
import { getArticle } from './getArticle'

interface AllArticleType {
  isFetching: boolean
  articlesData: ArticleType
}

export const useAllNewsArticle = (): AllArticleType => {
  const { data: articlesData, isLoading } = useSWR(
    ['/allNews'],
    () =>
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
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
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
  const { data: articlesData, isLoading } = useSWR(
    ['/lastetArticle'],
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
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
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
