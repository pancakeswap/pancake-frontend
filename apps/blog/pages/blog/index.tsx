import { FC } from 'react'
import { SWRConfig } from 'swr'
import { Box, Text } from '@pancakeswap/uikit'
import BlogCard from 'components/Blog/BlogCard'
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
    <Box>
      <Box width="1137px" margin="35px auto">
        <Text fontSize="40px" bold>
          Blog
        </Text>
        <Text bold color="textSubtle" mt="4px">
          Latest News about PancakeSwap and more!
        </Text>
      </Box>
      <BlogCard
        width="880px"
        margin="auto"
        imgHeight={500}
        imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
      />
    </Box>
  )
}

export default BlogPage
