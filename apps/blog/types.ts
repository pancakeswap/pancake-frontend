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
    ext: string
    hash: string
    alternativeText: string | null
    formats: {
      medium: {
        ext: string
        hash: string
      }
      small: {
        ext: string
        hash: string
      }
      thumbnail: {
        ext: string
        hash: string
      }
    }
  }
}

export interface ResponseArticleDataType {
  id: number
  attributes: {
    title: string
    slug: string
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

export interface PaginationType {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface ResponseArticleType {
  data: ResponseArticleDataType[]
  meta: {
    pagination: PaginationType
  }
}

export interface ResponseCategoriesType {
  id: number
  attributes: {
    name: string
  }
}

export interface Categories {
  id: number
  name: string
}
