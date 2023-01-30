import { SWRConfig } from 'swr'
import AllArticle from 'views/Blog/components/Article/AllArticle'
import { getCategories } from 'views/Blog/hooks/getArticle'
import { InferGetServerSidePropsType } from 'next'

export async function getStaticProps() {
  const categories = await getCategories()

  return {
    props: {
      fallback: {
        '/categories': categories,
      },
    },
    revalidate: 1,
  }
}

const AllArticlePage: React.FC<InferGetServerSidePropsType<typeof getStaticProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <AllArticle />
    </SWRConfig>
  )
}

export default AllArticlePage
