import { Swiper, SwiperSlide } from 'swiper/react'
import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BlogCard from 'components/Blog/BlogCard'
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
  return (
    <StyledChefsChoiceContainer justifyContent="center">
      <ArticleView title="Chef’s choice" subTitle="Read about our latest announcements and more">
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
            <BlogCard
              margin="auto"
              imgHeight={['200px']}
              imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <BlogCard
              margin="auto"
              imgHeight={['200px']}
              imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <BlogCard
              margin="auto"
              imgHeight={['200px']}
              imgUrl="https://www.shutterstock.com/image-photo/oil-field-workers-work-600w-393686092.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <BlogCard
              margin="auto"
              imgHeight={['200px']}
              imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <BlogCard
              margin="auto"
              imgHeight={['200px']}
              imgUrl="https://www.shutterstock.com/image-photo/oil-field-workers-work-600w-393686092.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <BlogCard
              margin="auto"
              imgHeight={['200px']}
              imgUrl="https://www.shutterstock.com/image-illustration/military-robot-destroyed-city-future-600w-1207217143.jpg"
            />
          </SwiperSlide>
        </Swiper>
      </ArticleView>
    </StyledChefsChoiceContainer>
  )
}

export default ChefsChoice
