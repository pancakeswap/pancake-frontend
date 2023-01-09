import { useRouter } from 'next/router'
// import { NotFound } from '@pancakeswap/uikit'

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

  return <>ArticlePage</>
}

export default ArticlePage
