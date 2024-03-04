import {
  ArticleDataType,
  ArticleType,
  Categories,
  ResponseArticleDataType,
  ResponseArticleType,
  ResponseCategoriesType,
} from '../types'
import { transformArticle } from '../utils/transformArticle'
import { fetchAPI } from './api'

interface GetArticleProps {
  url: string
  urlParamsObject?: Record<string, any>
}

export const getArticle = async ({ url, urlParamsObject = {} }: GetArticleProps): Promise<ArticleType> => {
  try {
    const response: ResponseArticleType = await fetchAPI(url, urlParamsObject)
    return {
      data: response.data.map((i: ResponseArticleDataType) => transformArticle(i)) ?? [],
      pagination: { ...response.meta.pagination },
    }
  } catch (error) {
    console.error('[ERROR] Fetching Article', error)
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
}

export const getSingleArticle = async ({ url, urlParamsObject = {} }: GetArticleProps): Promise<ArticleDataType> => {
  try {
    const response = await fetchAPI(url, urlParamsObject)
    return transformArticle(response.data as ResponseArticleDataType)
  } catch (error) {
    console.error('[ERROR] Fetching Single Article', error)
    return {
      id: 0,
      slug: '',
      title: '',
      locale: '',
      imgUrl: '',
      content: '',
      createAt: '',
      publishedAt: '',
      description: '',
      categories: [],
      newsOutBoundLink: '',
      newsFromPlatform: '',
      gamesCategories: [],
    }
  }
}

export const getCategories = async (filterTagArray: Array<string>): Promise<Categories[]> => {
  try {
    const response = await fetchAPI('/categories', {
      fields: 'name',
      filters: {
        name: {
          $notIn: filterTagArray,
        },
      },
    })

    return (response.data as ResponseCategoriesType[]).map((category) => ({
      id: category.id,
      name: category.attributes.name,
    }))
  } catch (error) {
    console.error('[ERROR] Fetching Categories', error)
    return []
  }
}
