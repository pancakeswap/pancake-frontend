import { SWRConfig } from 'swr'
import AllArticle from 'components/Article/AllArticle'

const AllArticlePage = ({ fallback }: { fallback: () => void }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <AllArticle />
    </SWRConfig>
  )
}

// export async function getStaticProps() {
//   const articles = await getArticles()
//   const categories = await getCategories()

//   return {
//     props: {
//       fallback: {
//         ['/articles']: articles?.articles || [],
//         ['/categories']: categories?.categories || [],
//       },
//     },
//     revalidate: 1,
//   }
// }

export default AllArticlePage
