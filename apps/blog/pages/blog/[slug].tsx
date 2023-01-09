import { useRouter } from 'next/router'

interface ArticlePage {
  article?: any // Article
  latestArticles?: any[] // Article[]
  preview: boolean
}

const ArticlePage = ({ article, latestArticles, preview }: ArticlePage) => {
  const router = useRouter()
  if (!router.isFallback && !article?.attributes?.slug) {
    // return <ErrorPage statusCode={404} />
    return null
  }

  return <>ArticlePage</>
}

export default ArticlePage
