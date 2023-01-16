import { Box } from '@pancakeswap/uikit'
import NewBlog from 'views/Blog/components/NewBlog'
import ChefsChoice from 'views/Blog/components/ChefsChoice'
import MoreButton from 'views/Blog/components/MoreButton'

const Blog = () => {
  return (
    <Box width="100%" mb="150px">
      <NewBlog />
      <ChefsChoice />
      <MoreButton />
    </Box>
  )
}

export default Blog
