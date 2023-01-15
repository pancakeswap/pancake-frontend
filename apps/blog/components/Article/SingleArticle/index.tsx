import { Box } from '@pancakeswap/uikit'
import ArticleInfo from 'components/Article/SingleArticle/ArticleInfo'
import HowItWork from 'components/Article/SingleArticle/HowItWork'
import SimilarArticles from 'components/Article/SingleArticle/SimilarArticles'

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
