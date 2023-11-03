import { getArticle } from 'hooks/getArticle'
import { ArticleDataType } from 'utils/transformArticle'
import { useQuery } from '@tanstack/react-query'

interface SearchBarArticle {
  isFetching: boolean
  articlesData: ArticleDataType[]
}

const useSearchBarArticle = (searchKey: string): SearchBarArticle => {
  const { data: articlesData, isLoading } = useQuery(
    [`/searchBarArticles`, searchKey],
    async () => {
      const result = await getArticle({
        url: '/articles',
        urlParamsObject: {
          ...(searchKey && { _q: searchKey }),
          locale: 'all',
          populate: 'categories,image',
          sort: 'createAt:desc',
          pagination: {
            limit: 10,
          },
        },
      })
      return result.data
    },
    {
      enabled: Boolean(searchKey),
    },
  )

  return {
    isFetching: isLoading,
    articlesData: articlesData ?? [],
  }
}

export default useSearchBarArticle
