import qs from 'qs'
import useSWR from 'swr'
import { ResponseArticleType, ResponseArticleDataType } from '../types'
import { transformArticle, ArticleType } from '../utils/transformArticle'
import { getArticle } from './getArticle'

interface UseAllArticleProps {
  query: string
  currentPage: number
  selectedCategories: string
  sortBy: string
  languageOption: string
}

interface AllArticleType {
  isFetching: boolean
  articlesData: ArticleType
}

const useAllNewsArticle = ({
  query,
  sortBy,
  currentPage,
  languageOption,
  selectedCategories,
}: UseAllArticleProps): AllArticleType => {
  const { data: articlesData, isLoading } = useSWR(
    ['/articles', query, currentPage, selectedCategories, sortBy, languageOption],
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

export default useAllNewsArticle
