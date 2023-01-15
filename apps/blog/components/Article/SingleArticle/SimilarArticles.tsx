import { Swiper, SwiperSlide } from 'swiper/react'
import { Button, Flex, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import BlogCard from 'components/Blog/BlogCard'
import { useTranslation } from '@pancakeswap/localization'
import { Autoplay, Grid } from 'swiper'
import ArticleView from 'components/Article/ArticleView'
import 'swiper/css/grid'
import 'swiper/css/bundle'

const SimilarArticles = () => {
  const { t } = useTranslation()

  return (
    <Flex maxWidth="100%" m="50px auto" flexDirection="column">
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
            <SwiperSlide>
              <NextLinkFromReactRouter to="/blog/article/1">
                <BlogCard
                  margin="auto"
                  padding={['0', '0', '18.5px']}
                  imgHeight={['200px']}
                  imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
                />
              </NextLinkFromReactRouter>
            </SwiperSlide>
          </Swiper>
        </ArticleView>
      </Flex>
      <NextLinkFromReactRouter to="/blog/article" style={{ margin: '50px auto' }}>
        <Button scale="md" variant="secondary">
          {t('More')}
        </Button>
      </NextLinkFromReactRouter>
    </Flex>
  )
}

export default SimilarArticles
