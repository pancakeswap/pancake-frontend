import { Swiper, SwiperSlide } from 'swiper/react'
import { Button, Flex } from '@pancakeswap/uikit'
import BlogCard from 'components/Blog/BlogCard'
import { Autoplay, Grid } from 'swiper'
import ArticleView from 'components/Article/ArticleView'
import 'swiper/css/grid'
import 'swiper/css/bundle'

const SimilarArticles = () => {
  return (
    <Flex maxWidth="100%" m="50px auto" flexDirection="column">
      <Flex justifyContent="center">
        <ArticleView title="You might also like">
          <Swiper
            loop
            resizeObserver
            slidesPerView={1}
            grid={{ rows: 1 }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Grid]}
            breakpoints={{
              768: {
                loop: true,
                slidesPerView: 1,
                grid: { rows: 1 },
              },
              920: {
                loop: true,
                slidesPerView: 2,
                grid: { rows: 1 },
              },
              1440: {
                loop: false,
                slidesPerView: 3,
                grid: { rows: 2 },
              },
            }}
          >
            <SwiperSlide>
              <BlogCard
                margin="auto"
                padding={['0', '0', '18.5px']}
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                margin="auto"
                padding={['0', '0', '18.5px']}
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-photo/oil-field-workers-work-600w-393686092.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                margin="auto"
                padding={['0', '0', '18.5px']}
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-illustration/military-robot-destroyed-city-future-600w-1207217143.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                margin="auto"
                padding={['0', '0', '18.5px']}
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-illustration/military-robot-destroyed-city-future-600w-1207217143.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                margin="auto"
                padding={['0', '0', '18.5px']}
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-photo/oil-field-workers-work-600w-393686092.jpg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <BlogCard
                margin="auto"
                padding={['0', '0', '18.5px']}
                imgHeight={['200px']}
                imgUrl="https://www.shutterstock.com/image-photo/adult-bearded-male-casual-clothes-600w-2080095523.jpg"
              />
            </SwiperSlide>
          </Swiper>
        </ArticleView>
      </Flex>
      <Button scale="md" m="50px auto" variant="secondary">
        Show More
      </Button>
    </Flex>
  )
}

export default SimilarArticles
