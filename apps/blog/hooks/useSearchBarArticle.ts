import { ArticleDataType } from '@pancakeswap/blog'
import { useQuery } from '@tanstack/react-query'
import { getArticle } from 'hooks/getArticle'

interface SearchBarArticle {
  isFetching: boolean
  articlesData: ArticleDataType[]
}

const useSearchBarArticle = (searchKey: string): SearchBarArticle => {
  const { data: articlesData, isPending } = useQuery({
    queryKey: [`/searchBarArticles`, searchKey],

    queryFn: async () => {
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

    enabled: Boolean(searchKey),
  })

  return {
    isFetching: isPending,
    articlesData: articlesData ?? [],
  }
}

export default useSearchBarArticle
