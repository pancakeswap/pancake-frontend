export interface CategoriesType {
  id: number
  attributes: {
    name: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface ArticleImageType {
  id: number
  attributes: {
    url: string
  }
}

export interface ResponseArticleType {
  id: number
  attributes: {
    title: string
    description: string
    createAt: string
    publishedAt: string
    content: string
    locale?: string
    categories: {
      data: CategoriesType[]
    }
    image: {
      data: ArticleImageType[]
    }
  }
}
