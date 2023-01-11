import { Box, Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Swiper, SwiperSlide } from 'swiper/react'
import BlogCard from 'components/Blog/BlogCard'
import { Autoplay } from 'swiper'
import 'swiper/css/bundle'

const StyledChoiceContainer = styled(Flex)`
  width: 100%;
  flex-direction: column;
  margin: 61px auto 48px auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 152px auto 80px auto;
  }
  @media screen and (min-width: 1440px) {
    width: 1400px;
  }
`

const StyledSliderContainer = styled(Flex)<{ isDark: boolean }>`
  position: relative;
  border-radius: 24px;
  padding: 12px 16px;
  background: ${({ isDark }) =>
    isDark
      ? 'radial-gradient(103.12% 50% at 50% 50%, #21193A 0%, #191326 100%)'
      : 'radial-gradient(50% 79.31% at 50% 50%, #FAF9FA 0%, #F5F3F8 100%)'};

  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 0;
  }
`

const SwiperContainer = styled(Box)`
  position: relative;
  width: 100%;
  margin: auto;
  top: -55px;

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 747px;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1139px;
  }
`

const StyledTitleContainer = styled(Box)`
  padding: 0 16px;
  margin-bottom: 64px;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 130px;
  }

  @media screen and (min-width: 1440px) {
    padding-left: 130px;
  }
`

const ChefsChoice = () => {
  const { isDark } = useTheme()

  return (
    <StyledChoiceContainer>
      <StyledTitleContainer>
        <Text bold mb="4px" color="secondary" fontSize={['24px', '24px', '24px', '40px']}>
          Chef’s choice
        </Text>
        <Text color="textSubtle" fontSize={['14px', '14px', '16px']}>
          Read about our latest announcements and more
        </Text>
      </StyledTitleContainer>
      <StyledSliderContainer isDark={isDark}>
        <SwiperContainer>
          <Swiper
            loop
            resizeObserver
            spaceBetween={37}
            slidesPerView={1}
            slidesPerGroup={1}
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
                // maxWidth="355px"
                margin="auto"
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                // maxWidth="355px"
                margin="auto"
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                // maxWidth="355px"
                margin="auto"
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-photo/oil-field-workers-work-600w-393686092.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                // maxWidth="355px"
                margin="auto"
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                // maxWidth="355px"
                margin="auto"
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-photo/oil-field-workers-work-600w-393686092.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                // maxWidth="355px"
                margin="auto"
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-illustration/military-robot-destroyed-city-future-600w-1207217143.jpg"
              />
            </SwiperSlide>
          </Swiper>
        </SwiperContainer>
      </StyledSliderContainer>
    </StyledChoiceContainer>
  )
}

export default ChefsChoice
