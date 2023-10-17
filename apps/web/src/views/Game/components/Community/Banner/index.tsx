import { useState } from 'react'
import NextLink from 'next/link'
import { styled } from 'styled-components'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, ChevronLeftIcon, ChevronRightIcon, useMatchBreakpoints } from '@pancakeswap/uikit'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { Autoplay } from 'swiper/modules'
import { GameCard } from 'views/Game/components/Community/Banner/GameCard'
import { Decorations } from 'views/Game/components/Decorations'

const StyledBackground = styled(Box)`
  position: relative;
  margin-bottom: 70px;
  padding: 30px 16px 0 16px;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-bottom: 105px;
    padding: 45px 16px 0 16px;
  }
`

const StyledGradientBg = styled('div')`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 110%;
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  border-bottom-left-radius: 50% 5%;
  border-bottom-right-radius: 50% 5%;

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 90%;
  }
`

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
  const { theme } = useTheme()
  const { isDesktop } = useMatchBreakpoints()
  const [swiper, setSwiper] = useState<SwiperClass | undefined>(undefined)

  const handlePrevSlide = () => {
    swiper?.slidePrev()
  }

  const handleNextSlide = () => {
    swiper?.slideNext()
  }

  return (
    <StyledBackground>
      <StyledGradientBg />
      <Decorations />
      <Flex
        position="relative"
        zIndex="1"
        margin="auto"
        flexDirection="column"
        justifyContent="space-between"
        maxWidth={['100%', '100%', '100%', '100%', '100%', '100%', '1257px']}
      >
        <Box
          mb={['23px', '23px', '23px', '23px', '60px']}
          width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}
        >
          <Text bold color="secondary" lineHeight="110%" fontSize={['40px']} mb={['8px', '8px', '8px', '8px', '24px']}>
            {isDesktop ? t('PancakeSwap Gaming Community') : t('Gaming Community')}
          </Text>
          <Text bold lineHeight="110%" fontSize={['16px', '16px', '16px', '16px', '24px']}>
            {t('Every Game, Every Chain, One Destination')}
          </Text>
        </Box>
        <Flex width="100%">
          {isDesktop && (
            <Flex alignItems="center" mr="32px">
              <ArrowButton onClick={handlePrevSlide}>
                <ChevronLeftIcon color={theme.colors.textSubtle} />
              </ArrowButton>
            </Flex>
          )}
          <Swiper
            loop
            resizeObserver
            // centeredSlides
            slidesPerView={1}
            spaceBetween={16}
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
              },
              920: {
                slidesPerView: 2,
              },
              1440: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
          >
            {test.map((introStep) => (
              <SwiperSlide key={introStep}>
                <NextLink passHref href="/">
                  <GameCard
                    id={introStep}
                    imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
                  />
                </NextLink>
              </SwiperSlide>
            ))}
          </Swiper>
          {isDesktop && (
            <Flex alignItems="center" ml="32px">
              <ArrowButton onClick={handleNextSlide}>
                <ChevronRightIcon color={theme.colors.textSubtle} />
              </ArrowButton>
            </Flex>
          )}
        </Flex>
      </Flex>
    </StyledBackground>
  )
}
