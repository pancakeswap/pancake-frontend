import { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { NotFound, Box } from '@pancakeswap/uikit'
import ArticleInfo from 'components/Article/SingleArticle/ArticleInfo'
import HowItWork from 'components/Article/SingleArticle/HowItWork'
import SimilarArticles from 'components/Article/SingleArticle/SimilarArticles'
import { InferGetServerSidePropsType } from 'next'
import { getArticle, getSingleArticle } from 'hooks/getArticle'
import PageMeta from 'components/PageMeta'

export async function getServerSideProps(context: any) {
  const params = context.params.slug
  const article = await getSingleArticle({
    url: `/slugify/slugs/article/${params}`,
    urlParamsObject: {
      populate: 'categories,image',
      locale: context?.query?.locale ?? 'en',
    },
  })

  const similarArticles = await getArticle({
    url: '/articles',
    urlParamsObject: {
      locale: article.locale,
      sort: 'createAt:desc',
      populate: 'categories,image',
      pagination: { limit: 6 },
      filters: {
        id: {
          $not: article.id,
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
        '/similarArticles': similarArticles.data,
      },
    },
  }
}

const ArticlePage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  const router = useRouter()
  if (!router.isFallback && !fallback?.['/article']?.title) {
    return <NotFound />
  }

  const { title, description, imgUrl } = fallback['/article']

  return (
    <div>
      <PageMeta title={title} description={description} imgUrl={imgUrl} />
      <SWRConfig value={{ fallback }}>
        <Box>
          <ArticleInfo />
          <HowItWork />
          <SimilarArticles />
        </Box>
      </SWRConfig>
    </div>
  )
}

export default ArticlePage
