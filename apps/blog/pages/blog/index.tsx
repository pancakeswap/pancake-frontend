import { FC } from 'react'
import { SWRConfig } from 'swr'
import { Box } from '@pancakeswap/uikit'
import NewBlog from 'components/Blog/NewBlog'
import Article from 'components/Article'
// import { InferGetServerSidePropsType } from 'next'

// export async function getStaticProps() {
//   const [articles, categories] = await Promise.all([getArticles({ pagination: { limit: 10 } }), getCategories()])
//   return {
//     props: {
//       fallback: {
//         ['/articles']: articles?.articles || [],
//         ['/categories']: categories?.categories || [],
//       },
//     },
//     revalidate: 60,
//   }
// }

const BlogPage = ({ fallback }: { fallback: () => void }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Blog />
    </SWRConfig>
  )
}

const Blog: FC = () => {
  return (
    <Box width="100%">
      <NewBlog />
      <Article />
    </Box>
  )
}

export default BlogPage
