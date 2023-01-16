import { FC } from 'react'
import { SWRConfig } from 'swr'
import Blog from 'views/Blog'
import { InferGetServerSidePropsType } from 'next'
import { getArticle } from 'views/Blog/hooks/getArticle'

export async function getStaticProps() {
  const [latestArticles, chefChoiceArticle] = await Promise.all([
    getArticle({
      populate: 'categories,image',
      sort: 'publishedAt:desc',
      pagination: { limit: 1 },
    }),
    getArticle({
      populate: 'categories,image',
      sort: 'publishedAt:desc',
      pagination: { limit: 9 },
      'filters[categories][name][$eq]': 'Chef’s choice',
    }),
  ])

  return {
    props: {
      fallback: {
        '/latestArticles': latestArticles,
        '/chefChoiceArticle': chefChoiceArticle,
      },
    },
    revalidate: 60,
  }
}

const BlogPage: FC<InferGetServerSidePropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Blog />
    </SWRConfig>
  )
}

export default BlogPage
