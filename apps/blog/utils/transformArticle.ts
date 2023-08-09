import { ResponseArticleDataType, PaginationType } from 'types'

export interface ArticleDataType {
  id: number
  slug: string
  title: string
  locale: string
  imgUrl: string
  content: string
  createAt: string
  publishedAt: string
  description: string
  categories: Array<string>
  newsOutBoundLink: string
  newsFromPlatform: string
}

export interface ArticleType {
  data: ArticleDataType[]
  pagination: PaginationType
}

export const transformArticle = (article: ResponseArticleDataType): ArticleDataType => {
  return {
    id: article.id,
    slug: article?.attributes?.slug ?? '',
    title: article?.attributes?.title ?? '',
    content: article?.attributes?.content ?? '',
    createAt: article?.attributes?.createAt ?? '',
    publishedAt: article?.attributes?.publishedAt ?? '',
    locale: article?.attributes?.locale ?? '',
    description: article?.attributes?.description ?? '',
    newsFromPlatform: article?.attributes?.newsFromPlatform ?? '',
    newsOutBoundLink: article?.attributes?.newsOutBoundLink ?? '',
    imgUrl: article?.attributes?.image?.data?.attributes?.url ?? '',
    categories: article.attributes?.categories?.data?.map((i) => i.attributes.name),
  }
}
