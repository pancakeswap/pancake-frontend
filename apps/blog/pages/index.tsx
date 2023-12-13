import { InferGetServerSidePropsType } from 'next'
import { getArticle, getCategories } from 'hooks/getArticle'
import { Box } from '@pancakeswap/uikit'
import NewBlog from 'components/NewBlog'
import ChefsChoice from 'components/ChefsChoice'
import AllArticle from 'components/Article/AllArticle'
import { filterTagArray } from 'utils/filterTagArray'
import { dehydrate, QueryClient } from '@tanstack/react-query'

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['/latestArticles'], () =>
    getArticle({
      url: '/articles',
      urlParamsObject: {
        populate: 'categories,image',
        sort: 'createAt:desc',
        pagination: { limit: 1 },
        filters: {
          categories: {
            name: {
              $notIn: filterTagArray,
            },
          },
        },
      },
    }).then((latestArticles) => latestArticles.data),
  )

  await queryClient.prefetchQuery(['/chefChoiceArticle'], () =>
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
    }).then((article) => article.data),
  )

  await queryClient.prefetchQuery(['/categories'], () => getCategories())

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60,
  }
}

const BlogPage: React.FC<InferGetServerSidePropsType<typeof getStaticProps>> = () => {
  return (
    <Box width="100%" mb="150px">
      <NewBlog />
      <ChefsChoice />
      <AllArticle />
    </Box>
  )
}

export default BlogPage
