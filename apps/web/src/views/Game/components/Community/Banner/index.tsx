import { Box, Flex, Text, Button, Link, PageSection } from '@pancakeswap/uikit'
import { useTheme } from '@pancakeswap/hooks'
import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import NextLink from 'next/link'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import { GameCard } from 'views/Game/components/Community/Banner/GameCard'

import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { Autoplay, Navigation } from 'swiper/modules'

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

const test = [1, 2, 3, 4]

export const Banner = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

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
        width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}
      >
        <Box mb={['60px']}>
          <Text color="secondary" bold mb="24px" lineHeight="110%" fontSize={['40px']}>
            {t('PancakeSwap Gaming Community')}
          </Text>
          <Text bold lineHeight="110%" fontSize={['16px', '16px', '16px', '24px']}>
            {t('Every Game, Every Chain, One Destination')}
          </Text>
        </Box>

        {/* <Swiper
          loop
          resizeObserver
          slidesPerView={3}
          spaceBetween={20}
          autoplay={{
            delay: 2500,
            pauseOnMouseEnter: true,
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
            1200: {
              slidesPerView: 3,
              spaceBetween: 0,
            },
          }}
        >
          <SwiperSlide>
            <GameCard
              // padding="16px"
              imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <GameCard
              // padding="16px"
              imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
            />
          </SwiperSlide>
          <SwiperSlide>
            <GameCard
              // padding="16px"
              imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
            />
          </SwiperSlide>
        </Swiper> */}
        <Box width="100%">
          <Swiper
            loop
            slidesPerView={3}
            spaceBetween={16}
            modules={[Autoplay, Navigation]}
            autoplay={{
              delay: 2500,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: '.prev',
              nextEl: '.next',
            }}
          >
            {test.map((introStep) => (
              <SwiperSlide key={introStep}>
                <NextLink passHref href="/articles">
                  <GameCard imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg" />
                </NextLink>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Flex>
    </PageSection>
  )
}
