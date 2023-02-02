import { Swiper, SwiperSlide } from 'swiper/react'
import { Flex } from '@pancakeswap/uikit'
import BlogCard from 'components/Blog/BlogCard'
import { useTranslation } from '@pancakeswap/localization'
import { Autoplay } from 'swiper'
import ArticleView from 'components/Blog/Article/ArticleView'
import NextLink from 'next/link'
import MoreButton from 'components/Blog/MoreButton'
import useSWR from 'swr'
import { ArticleDataType } from 'utils/transformArticle'
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
              loop
              resizeObserver
              slidesPerView={1}
              spaceBetween={20}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                920: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1440: {
                  slidesPerView: 3,
                  spaceBetween: 0,
                },
              }}
            >
              {similarArticles?.map((article) => (
                <SwiperSlide key={article.id}>
                  <NextLink passHref href={`/${article.id}`}>
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
