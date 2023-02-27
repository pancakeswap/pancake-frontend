import qs from 'qs'
import useSWR from 'swr'
import { ResponseArticleType, ResponseArticleDataType } from 'types'
import { transformArticle, ArticleType } from 'utils/transformArticle'

interface UseAllArticleProps {
  query: string
  currentPage: number
  selectedCategories: number
  sortBy: string
  languageOption: string
}

interface AllArticleType {
  isFetching: boolean
  articlesData: ArticleType
}

const useAllArticle = ({
  query,
  sortBy,
  currentPage,
  languageOption,
  selectedCategories,
}: UseAllArticleProps): AllArticleType => {
  const { data: articlesData, isLoading } = useSWR(
    ['/articles', query, currentPage, selectedCategories, sortBy, languageOption],
    async () => {
      try {
        const urlParamsObject = {
          ...(query && { _q: query }),
          filters: {
            ...(selectedCategories && {
              categories: {
                id: {
                  $eq: selectedCategories,
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
        const response = await fetch(`/api/articles?${queryString}`)
        const result: ResponseArticleType = await response.json()
        return {
          data: result.data.map((i: ResponseArticleDataType) => transformArticle(i)) ?? [],
          pagination: { ...result.meta.pagination },
        }
      } catch (error) {
        console.error('Fetch All Article Error: ', error)
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

export default useAllArticle
