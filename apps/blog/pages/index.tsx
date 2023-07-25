import { SWRConfig } from 'swr'
import { InferGetServerSidePropsType } from 'next'
import { getArticle, getCategories } from 'hooks/getArticle'
import { Box } from '@pancakeswap/uikit'
import NewBlog from 'components/NewBlog'
import ChefsChoice from 'components/ChefsChoice'
import AllArticle from 'components/Article/AllArticle'

export async function getStaticProps() {
  const [latestArticles, chefChoiceArticle, categories] = await Promise.all([
    getArticle({
      url: '/articles',
      urlParamsObject: {
        populate: 'categories,image',
        sort: 'createAt:desc',
        pagination: { limit: 1 },
        filters: {
          categories: {
            name: {
              $not: 'News',
            },
          },
        },
      },
    }),
    getArticle({
      url: '/articles',
      urlParamsObject: {
        populate: 'categories,image',
        sort: 'createAt:desc',
        pagination: { limit: 9 },
        filters: {
          categories: {
            name: {
              $eq: 'Chef’s choice',
            },
          },
        },
      },
    }),
    getCategories(),
  ])

  return {
    props: {
      fallback: {
        '/latestArticles': latestArticles.data,
        '/chefChoiceArticle': chefChoiceArticle.data,
        '/categories': categories,
      },
    },
    revalidate: 60,
  }
}

const BlogPage: React.FC<InferGetServerSidePropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Box width="100%" mb="150px">
        <NewBlog />
        <ChefsChoice />
        <AllArticle />
      </Box>
    </SWRConfig>
  )
}

export default BlogPage
