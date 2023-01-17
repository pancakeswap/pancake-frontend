import { Swiper, SwiperSlide } from 'swiper/react'
import { Flex } from '@pancakeswap/uikit'
import BlogCard from 'views/Blog/components/BlogCard'
import { useTranslation } from '@pancakeswap/localization'
import { Autoplay, Grid } from 'swiper'
import ArticleView from 'views/Blog/components/Article/ArticleView'
import NextLink from 'next/link'
import MoreButton from 'views/Blog/components/MoreButton'
import useSWR from 'swr'
import { ArticleDataType } from 'views/Blog/utils/transformArticle'
import 'swiper/css/grid'
import 'swiper/css/bundle'

const SimilarArticles = () => {
  const { t } = useTranslation()
  const { data: similarArticles } = useSWR<ArticleDataType[]>('/similarArticles')

  return (
    <Flex maxWidth="100%" m="50px auto" flexDirection="column">
      {similarArticles && similarArticles?.length > 0 && (
        <Flex justifyContent="center">
          <ArticleView title={t('You might also like')}>
            <Swiper
              resizeObserver
              slidesPerView={1}
              grid={{ rows: 1 }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, Grid]}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  grid: { rows: 1 },
                },
                920: {
                  slidesPerView: 2,
                  grid: { rows: 1 },
                },
                1440: {
                  slidesPerView: 3,
                  grid: { rows: 2 },
                },
              }}
            >
              {similarArticles?.map((article) => (
                <SwiperSlide key={article.id}>
                  <NextLink passHref href={`/blog/article/${article.id}`}>
                    <BlogCard
                      margin="auto"
                      padding={['0', '0', '18.5px']}
                      imgHeight={['200px']}
                      article={article}
                      imgUrl={article.imgUrl}
                    />
                  </NextLink>
                </SwiperSlide>
              ))}
            </Swiper>
          </ArticleView>
        </Flex>
      )}
      <MoreButton />
    </Flex>
  )
}

export default SimilarArticles
