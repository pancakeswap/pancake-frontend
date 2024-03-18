import { ArticleType, ResponseArticleDataType, ResponseArticleType, transformArticle } from '@pancakeswap/blog'
import { useQuery } from '@tanstack/react-query'
import qs from 'qs'
import { filterTagArray } from 'utils/filterTagArray'

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
  const { data: articlesData, isPending } = useQuery({
    queryKey: ['/articles', query, currentPage, selectedCategories, sortBy, languageOption],

    queryFn: async () => {
      try {
        const urlParamsObject = {
          ...(query && { _q: query }),
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
                    $notIn: filterTagArray,
                  },
                  ...(selectedCategories && {
                    id: {
                      $eq: selectedCategories,
                    },
                  }),
                },
              },
            ],
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

    refetchOnMount: false,
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

export default useAllArticle
