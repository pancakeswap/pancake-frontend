import { Box } from '@pancakeswap/uikit'
import NewBlog from 'views/Blog/components/NewBlog'
import ChefsChoice from 'views/Blog/components/ChefsChoice'
import AllArticle from 'views/Blog/components/Article/AllArticle'

const Blog = () => {
  return (
    <Box width="100%" mb="150px">
      <NewBlog />
      <ChefsChoice />
      <AllArticle />
    </Box>
  )
}

export default Blog
