import { Swiper, SwiperSlide } from 'swiper/react'
import { Flex, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BlogCard from 'components/Blog/BlogCard'
import { useTranslation } from '@pancakeswap/localization'
import { Autoplay } from 'swiper'
import ArticleView from 'components/Article/ArticleView'
import 'swiper/css/bundle'

const StyledChefsChoiceContainer = styled(Flex)`
  margin: 61px auto 48px auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 152px auto 80px auto;
  }
`

const ChefsChoice = () => {
  const { t } = useTranslation()

  return (
    <StyledChefsChoiceContainer justifyContent="center">
      <ArticleView title={t('Chef’s choice')} subTitle={t('Read about our latest announcements and more')}>
        <Swiper
          loop
          resizeObserver
          spaceBetween={37}
          slidesPerView={1}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            768: {
              slidesPerView: 1,
            },
            920: {
              slidesPerView: 2,
            },
            1440: {
              slidesPerView: 3,
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
    </StyledChefsChoiceContainer>
  )
}

export default ChefsChoice
