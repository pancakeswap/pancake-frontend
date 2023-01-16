import { fetchAPI } from 'views/Blog/utils/api'
import { ResponseArticleType } from 'views/Blog/types'
import { transformArticle, ArticleType } from 'views/Blog/utils/transformArticle'
// pagination: { page: 1, pageSize: 1 },

export const getArticle = async (urlParamsObject = {}): Promise<ArticleType[]> => {
  try {
    const response = await fetchAPI('/articles', urlParamsObject)
    return response.data.map((i: ResponseArticleType) => transformArticle(i)) ?? []
  } catch (error) {
    console.error('[ERROR] Fetching Article', error)
    return []
  }
}
