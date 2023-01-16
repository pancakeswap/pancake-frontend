import Head from 'next/head'

interface PageMetaProps {
  title: string
  description: string
  imgUrl: string
}

const PageMeta = ({ title, description, imgUrl }: PageMetaProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imgUrl} />
    </Head>
  )
}

export default PageMeta
