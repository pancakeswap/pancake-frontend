import { SWRConfig } from 'swr'
import Blog from 'views/Blog'
import { InferGetServerSidePropsType } from 'next'
import { getArticle, getCategories } from 'views/Blog/hooks/getArticle'

export async function getStaticProps() {
  const [latestArticles, chefChoiceArticle, categories] = await Promise.all([
    getArticle({
      url: '/articles',
      urlParamsObject: {
        populate: 'categories,image',
        sort: 'createAt:desc',
        pagination: { limit: 1 },
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
      <Blog />
    </SWRConfig>
  )
}

export default BlogPage
