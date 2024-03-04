import { ArticleDataType, ResponseArticleDataType } from '../types'

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
    imgUrl: article?.attributes?.image?.data?.[0]?.attributes?.url ?? '',
    categories: article.attributes?.categories?.data?.map((i) => i.attributes.name),
    gamesCategories: article.attributes?.['games-categories']?.data?.map((i) => i.attributes.name) ?? [],
  }
}
