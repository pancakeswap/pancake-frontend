import { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { NotFound, Box } from '@pancakeswap/uikit'
import ArticleInfo from 'components/Article/SingleArticle/ArticleInfo'
import { InferGetStaticPropsType, GetStaticProps } from 'next'
import { getSingleArticle } from 'hooks/getArticle'
import PageMeta from 'components/PageMeta'

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = (async ({ params }) => {
  if (!params)
    return {
      redirect: {
        permanent: false,
        statusCode: 404,
        destination: '/404',
      },
    }

  const { slug } = params

  const article = await getSingleArticle({
    url: `/slugify/slugs/article/${slug}`,
    urlParamsObject: {
      populate: 'categories,image',
      locale: 'all',
      filters: {
        categories: {
          name: {
            $eq: 'Preview',
          },
        },
      },
    },
  })

  return {
    props: {
      fallback: {
        '/preview-article': article,
      },
    },
    revalidate: 60,
  }
}) satisfies GetStaticProps

const PreviewArticlePage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
  const router = useRouter()
  if (!router.isFallback && !fallback?.['/preview-article']?.title) {
    return <NotFound />
  }

  const { title, description, imgUrl } = fallback['/preview-article']

  return (
    <div>
      <PageMeta title={title} description={description} imgUrl={imgUrl} />
      <SWRConfig value={{ fallback }}>
        <Box>
          <ArticleInfo articleName="/preview-article" />
        </Box>
      </SWRConfig>
    </div>
  )
}

export default PreviewArticlePage
