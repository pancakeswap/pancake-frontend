import { ArticleDataType } from '@pancakeswap/blog'
import { useTranslation } from '@pancakeswap/localization'
import { Flex } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import ArticleView from 'components/Article/ArticleView'
import BlogCard from 'components/BlogCard'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import { styled } from 'styled-components'
import 'swiper/css/bundle'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const StyledChefsChoiceContainer = styled(Flex)`
  margin: 61px auto 48px auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 120px auto 80px auto;
  }
`

const ChefsChoice = () => {
  const { t } = useTranslation()
  const { data: articlesData } = useQuery<ArticleDataType[]>({
    queryKey: ['/chefChoiceArticle'],
    enabled: false,
  })

  return (
    <StyledChefsChoiceContainer justifyContent="center">
      <ArticleView title={t('Chef’s choice')} subTitle={t('Recommended Readings by Chefs')}>
        <Swiper
          loop
          resizeObserver
          slidesPerView={1}
          spaceBetween={20}
          autoplay={{
            delay: 2500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            768: {
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
          {articlesData?.map((article) => (
            <SwiperSlide key={article.id}>
              <NextLink passHref href={`/articles/${article?.slug}`}>
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
    </StyledChefsChoiceContainer>
  )
}

export default dynamic(() => Promise.resolve(ChefsChoice), {
  ssr: false,
})
