import { Box } from '@pancakeswap/uikit'
import ArticleInfo from 'views/Blog/components/Article/SingleArticle/ArticleInfo'
import HowItWork from 'views/Blog/components/Article/SingleArticle/HowItWork'
import SimilarArticles from 'views/Blog/components/Article/SingleArticle/SimilarArticles'

const SingleArticle = () => {
  return (
    <Box>
      <ArticleInfo />
      <HowItWork />
      <SimilarArticles />
    </Box>
  )
}

export default SingleArticle
