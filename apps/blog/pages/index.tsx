import { Box } from '@pancakeswap/uikit'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import AllArticle from 'components/Article/AllArticle'
import ChefsChoice from 'components/ChefsChoice'
import NewBlog from 'components/NewBlog'
import { getArticle, getCategories } from 'hooks/getArticle'
import { InferGetServerSidePropsType } from 'next'
import { filterTagArray } from 'utils/filterTagArray'

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['/latestArticles'],
    queryFn: async () =>
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
  })

  await queryClient.prefetchQuery({
    queryKey: ['/chefChoiceArticle'],
    queryFn: async () =>
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
  })

  await queryClient.prefetchQuery({
    queryKey: ['/categories'],
    queryFn: getCategories,
  })

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
