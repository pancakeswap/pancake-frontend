import useSWR from 'swr'
import { getArticle } from 'hooks/getArticle'
import { ArticleDataType } from 'utils/transformArticle'

interface SearchBarArticle {
  isFetching: boolean
  articlesData: ArticleDataType[]
}

const useSearchBarArticle = (searchKey: string): SearchBarArticle => {
  const { data: articlesData, isLoading } = useSWR(searchKey && [`/searchBarArticles`, searchKey], async () => {
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
  })

  return {
    isFetching: isLoading,
    articlesData: articlesData ?? [],
  }
}

export default useSearchBarArticle
