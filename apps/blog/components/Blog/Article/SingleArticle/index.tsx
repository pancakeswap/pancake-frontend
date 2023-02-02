import { Box } from '@pancakeswap/uikit'
import ArticleInfo from 'components/Blog/Article/SingleArticle/ArticleInfo'
import HowItWork from 'components/Blog/Article/SingleArticle/HowItWork'
import SimilarArticles from 'components/Blog/Article/SingleArticle/SimilarArticles'

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
