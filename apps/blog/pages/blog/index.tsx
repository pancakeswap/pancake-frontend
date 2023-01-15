import { FC } from 'react'
import { SWRConfig } from 'swr'
import { Box, Flex, Button } from '@pancakeswap/uikit'
import NewBlog from 'components/Blog/NewBlog'
import ChefsChoice from 'components/ChefsChoice'
import { useTranslation } from '@pancakeswap/localization'
import NextLink from 'next/link'

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
  const { t } = useTranslation()

  return (
    <Box width="100%" mb="150px">
      <NewBlog />
      <ChefsChoice />
      <Flex justifyContent="center" m="50px auto">
        <NextLink href="/blog/article" passHref>
          <Button scale="md" variant="secondary">
            {t('More')}
          </Button>
        </NextLink>
      </Flex>
    </Box>
  )
}

export default BlogPage
