import { NextSeo } from 'next-seo'

interface PageMetaProps {
  title: string
  description: string
  imgUrl: string
}

const PageMeta = ({ title, description, imgUrl }: PageMetaProps) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        images: [{ url: imgUrl }],
      }}
    />
  )
}

export default PageMeta
