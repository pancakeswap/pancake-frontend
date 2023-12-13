import qs from 'qs'
import { useQuery } from '@tanstack/react-query'
import {
  ResponseArticleType,
  ResponseArticleDataType,
  transformArticle,
  ArticleType,
  fetchAPI,
} from '@pancakeswap/blog'

interface UseAllGamesArticleProps {
  query: string
  currentPage: number
  selectedGamesCategories: number
  sortBy: string
  languageOption: string
}

interface AllGamesArticleType {
  isFetching: boolean
  articlesData: ArticleType
}

export const useAllGamesArticle = ({
  query,
  sortBy,
  currentPage,
  languageOption,
  selectedGamesCategories,
}: UseAllGamesArticleProps): AllGamesArticleType => {
  const { data: articlesData, isLoading } = useQuery(
    ['games-articles', query, currentPage, selectedGamesCategories, sortBy, languageOption],
    async () => {
      try {
        const urlParamsObject = {
          ...(query && { _q: query }),
          filters: {
            categories: {
              name: {
                $eq: 'Games',
              },
            },
            ...(selectedGamesCategories && {
              'games-categories': {
                id: {
                  $eq: selectedGamesCategories,
                },
              },
            }),
          },
          locale: languageOption,
          populate: 'categories,image',
          sort: sortBy,
          pagination: {
            page: currentPage,
            pageSize: 10,
          },
        }

        const queryString = qs.stringify(urlParamsObject)
        const result: ResponseArticleType = await fetchAPI(`/articles?${queryString}`)
        return {
          data: result.data.map((i: ResponseArticleDataType) => transformArticle(i)) ?? [],
          pagination: { ...result.meta.pagination },
        }
      } catch (error) {
        console.error('Fetch All Games Article Error: ', error)
        return {
          data: [],
          pagination: {
            page: 0,
            pageSize: 0,
            pageCount: 0,
            total: 0,
          },
        }
      }
    },
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
