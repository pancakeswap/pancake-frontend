import { FC } from 'react'
import { SWRConfig } from 'swr'
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

const Blog: FC = () => {
  return <>Blog Page</>
}

export default BlogPage
