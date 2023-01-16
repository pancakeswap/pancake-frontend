import { fetchAPI } from 'views/Blog/utils/api'
import { ResponseArticleType } from 'views/Blog/types'
import { transformArticle, ArticleType } from 'views/Blog/utils/transformArticle'
// pagination: { page: 1, pageSize: 1 },

interface GetArticleProps {
  url: string
  urlParamsObject?: Record<string, any>
}

export const getArticle = async ({ url, urlParamsObject = {} }: GetArticleProps): Promise<ArticleType[]> => {
  try {
    const response = await fetchAPI(url, urlParamsObject)
    return response.data.map((i: ResponseArticleType) => transformArticle(i)) ?? []
  } catch (error) {
    console.error('[ERROR] Fetching Article', error)
    return []
  }
}

export const getSingleArticle = async ({ url, urlParamsObject = {} }: GetArticleProps): Promise<ArticleType> => {
  try {
    const response = await fetchAPI(url, urlParamsObject)
    return transformArticle(response.data as ResponseArticleType)
  } catch (error) {
    console.error('[ERROR] Fetching Single Article', error)
    return {
      id: 0,
      title: '',
      locale: '',
      imgUrl: '',
      content: '',
      createAt: '',
      publishedAt: '',
      description: '',
      categories: [],
    }
  }
}
