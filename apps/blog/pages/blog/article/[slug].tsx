import { useRouter } from 'next/router'
import { NotFound } from '@pancakeswap/uikit'
import SingleArticle from 'views/Blog/components/Article/SingleArticle'

interface ArticlePage {
  article?: any // Article
  latestArticles?: any[] // Article[]
  preview: boolean
}

const ArticlePage = ({ article, latestArticles, preview }: ArticlePage) => {
  const router = useRouter()
  // if (!router.isFallback && !article?.attributes?.slug) {
  //   return <NotFound />
  // }

  return <SingleArticle />
}

export default ArticlePage
