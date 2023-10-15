import { useState } from 'react'
import NextLink from 'next/link'
import { styled } from 'styled-components'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, ChevronLeftIcon, ChevronRightIcon, PageSection } from '@pancakeswap/uikit'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { Autoplay } from 'swiper/modules'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import { GameCard } from 'views/Game/components/Community/Banner/GameCard'

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 60%;
  pointer-events: none;
  overflow: hidden;
  transform: translateX(-50%);
  z-index: 1;
  > img {
    position: absolute;
  }

  & :nth-child(1) {
    top: 40%;
    left: 0%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(2) {
    top: 40%;
    left: 2%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }

  & :nth-child(3) {
    right: 0%;
    top: 40%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(4) {
    right: -1%;
    top: 28%;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
  }

  & :nth-child(5) {
    right: 8%;
    bottom: 0%;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }
}`

const ArrowButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  svg path {
    fill: ${({ theme }) => theme.colors.primary};
  }
  cursor: pointer;
`

const test = [1, 2, 3, 4]

export const Banner = () => {
  const { t } = useTranslation()
  const { theme, isDark } = useTheme()
  const [swiper, setSwiper] = useState<SwiperClass | undefined>(undefined)

  const handlePrevSlide = () => {
    swiper?.slidePrev()
  }

  const handleNextSlide = () => {
    swiper?.slideNext()
  }

  return (
    <PageSection
      index={1}
      position="relative"
      hasCurvedDivider={false}
      background={
        isDark
          ? 'linear-gradient(140deg, #313D5C 0%, #3D2A54 100%)'
          : 'linear-gradient(140deg, #E5FDFF 0%, #F3EFFF 100%)'
      }
    >
      <Decorations>
        <img src="/images/game/developers/left-1.png" width="79px" height="207px" alt="left1" />
        <img src="/images/game/developers/star.png" width="49px" height="43px" alt="star" />
        <img src="/images/game/developers/right-1.png" width="80px" height="150px" alt="right1" />
        <img src="/images/game/developers/right-2.png" width="109px" height="123px" alt="right2" />
        <img src="/images/game/developers/star.png" width="67px" height="59px" alt="star2" />
      </Decorations>
      <Flex
        position="relative"
        zIndex="1"
        margin="auto"
        flexDirection="column"
        justifyContent="space-between"
        width={['100%', '100%', '100%', '100%', '100%', '100%', '1257px']}
      >
        <Box mb={['60px']} width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}>
          <Text color="secondary" bold mb="24px" lineHeight="110%" fontSize={['40px']}>
            {t('PancakeSwap Gaming Community')}
          </Text>
          <Text bold lineHeight="110%" fontSize={['16px', '16px', '16px', '24px']}>
            {t('Every Game, Every Chain, One Destination')}
          </Text>
        </Box>
        <Flex width="100%">
          <Flex alignItems="center" mr="32px">
            <ArrowButton onClick={handlePrevSlide}>
              <ChevronLeftIcon color={theme.colors.textSubtle} />
            </ArrowButton>
          </Flex>
          <Swiper
            loop
            resizeObserver
            centeredSlides
            slidesPerView={1}
            spaceBetween={20}
            onSwiper={setSwiper}
            modules={[Autoplay]}
            autoplay={{
              delay: 2500,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              920: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
          >
            {test.map((introStep) => (
              <SwiperSlide key={introStep}>
                <NextLink passHref href="/">
                  <GameCard
                    width={['355px']}
                    id={introStep}
                    imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
                  />
                </NextLink>
              </SwiperSlide>
            ))}
          </Swiper>
          <Flex alignItems="center" ml="32px">
            <ArrowButton onClick={handleNextSlide}>
              <ChevronRightIcon color={theme.colors.textSubtle} />
            </ArrowButton>
          </Flex>
        </Flex>
      </Flex>
    </PageSection>
  )
}
