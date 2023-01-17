import useSWR from 'swr'
import { getArticle } from 'views/Blog/hooks/getArticle'
import { ArticleType } from 'views/Blog/utils/transformArticle'

interface UseAllArticleProps {
  query: string
  currentPage: number
  selectedCategories: number
  sortBy: string
  languageOption: string
}

interface AllArticleType {
  isValidating: boolean
  articlesData: ArticleType
}

const useAllArticle = ({
  query,
  sortBy,
  currentPage,
  languageOption,
  selectedCategories,
}: UseAllArticleProps): AllArticleType => {
  const { data: articlesData, isValidating } = useSWR(
    [`/articles`, query, currentPage, selectedCategories, sortBy, languageOption],
    async () => {
      const result = await getArticle({
        url: '/articles',
        urlParamsObject: {
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
        },
      })

      return result
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
    },
  )

  return {
    isValidating,
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
