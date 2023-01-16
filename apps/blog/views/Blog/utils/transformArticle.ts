import { ResponseArticleType } from 'views/Blog/types'
import { getStrapiURL } from 'views/Blog/utils/api'

export interface ArticleType {
  id: number
  title: string
  locale: string
  imgUrl: string
  content: string
  createAt: string
  publishedAt: string
  description: string
  categories: Array<string>
}

export const transformArticle = (article: ResponseArticleType): ArticleType => {
  return {
    id: article.id,
    title: article.attributes.title,
    content: article.attributes.content,
    createAt: article.attributes.createAt,
    publishedAt: article.attributes.publishedAt,
    locale: article.attributes.locale ?? '',
    description: article.attributes.description,
    imgUrl: getStrapiURL(article.attributes.image.data[0].attributes.url) ?? '',
    categories: article.attributes.categories.data.map((i) => i.attributes.name),
  }
}
