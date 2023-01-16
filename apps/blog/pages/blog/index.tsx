import { SWRConfig } from 'swr'
import Blog from 'views/Blog'

// import { InferGetServerSidePropsType } from 'next'

// export async function getStaticProps() {
//   const [articles, categories] = await Promise.all([getArticles({ pagination: { limit: 10 } }), getCategories()])
//   return {
//     props: {
//       fallback: {
//         ['/articles']: articles?.articles || [],
//         ['/categories']: categories?.categories || [],
//       },
//     },
//     revalidate: 60,
//   }
// }

const BlogPage = ({ fallback }: { fallback: () => void }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Blog />
    </SWRConfig>
  )
}

export default BlogPage
