import { FC } from 'react'
import { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { NotFound } from '@pancakeswap/uikit'
import SingleArticle from 'views/Blog/components/Article/SingleArticle'
import { InferGetServerSidePropsType } from 'next'
import { getArticle, getSingleArticle } from 'views/Blog/hooks/getArticle'
import PageMeta from 'components/PageMeta'

export const getServerSideProps = async (context: any) => {
  const params = context.params.slug
  const article = await getSingleArticle({
    url: `/articles/${params}`,
    urlParamsObject: { populate: 'categories,image' },
  })

  const similarArticles = await getArticle({
    url: '/articles',
    urlParamsObject: {
      locale: article.locale,
      populate: 'categories,image',
      pagination: { limit: 6 },
      filters: {
        id: {
          $not: params,
        },
        categories: {
          $or: article.categories.map((category) => ({
            name: {
              $eq: category,
            },
          })),
        },
      },
    },
  })

  return {
    props: {
      fallback: {
        '/article': article,
        '/similarArticles': similarArticles,
      },
    },
  }
}

const ArticlePage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  const router = useRouter()
  const { title, description, imgUrl } = fallback['/article']

  if (!router.isFallback && !title) {
    return <NotFound />
  }

  return (
    <>
      <PageMeta title={title} description={description} imgUrl={imgUrl} />
      <SWRConfig value={{ fallback }}>
        <SingleArticle />
      </SWRConfig>
    </>
  )
}

export default ArticlePage
