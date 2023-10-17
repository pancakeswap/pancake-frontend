import { useState } from 'react'
import { styled } from 'styled-components'
import Image from 'next/image'
import {
  Flex,
  Box,
  Text,
  Button,
  CardHeader,
  Link,
  Card,
  ChevronLeftIcon,
  ChevronRightIcon,
  TelegramIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import 'swiper/css'
import 'swiper/css/autoplay'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'

const StyledGameContainer = styled(Flex)<{ isHorizontal?: boolean }>`
  flex-direction: column;
  margin: auto;
  padding-bottom: 82px;
  width: ${({ isHorizontal }) => (isHorizontal ? '1101px' : '948px')};
`
const StyledGameInfoContainer = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const StyledGameInformation = styled(Flex)<{ isHorizontal?: boolean }>`
  margin-left: 32px;
  flex-direction: column;
  width: ${({ isHorizontal }) => (isHorizontal ? '365px' : '467px')};
`

const Header = styled(CardHeader)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 112px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  background-image: url('/images/ifos/sable-bg.png');
  ${({ theme }) => theme.mediaQueries.md} {
    height: 112px;
  }
`

const StyledTag = styled(Button)<{ isPurple?: boolean }>`
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 400;
  box-shadow: 0px 0px 1px 0px #757575;
  border: ${({ theme, isPurple }) => `solid 1px ${isPurple ? theme.colors.secondary : theme.colors.textSubtle}`};
  color: ${({ theme, isPurple }) => (isPurple ? 'white' : theme.colors.textSubtle)};
  background-color: ${({ theme, isPurple }) => (isPurple ? theme.colors.secondary : theme.card.background)};
`

const StyledTagContainer = styled(Flex)`
  flex-wrap: wrap;
  ${StyledTag} {
    margin: 8px 4px 0 0;
  }
`

const StyledLeftContainer = styled(Box)<{ isHorizontal?: boolean }>`
  min-width: ${({ isHorizontal }) => (isHorizontal ? '671px' : '392px')};
`

const StyledCarouselContainer = styled(Box)<{ isHorizontal?: boolean }>`
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  height: ${({ isHorizontal }) => (isHorizontal ? '429px' : '100%')};
`

const StyledCarouselImage = styled(Box)<{ imgUrl: string; isActive?: boolean; isHorizontal?: boolean }>`
  height: ${({ isHorizontal }) => (isHorizontal ? '104px' : '143px')};
  width: ${({ isHorizontal }) => (isHorizontal ? '157px' : '96px')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  border-radius: 8px;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
  border: ${({ theme, isActive }) => `solid 3px  ${isActive ? theme.colors.primary : 'black'}`};
`

const StyledSwiperContainer = styled(Box)<{ isHorizontal?: boolean }>`
  position: relative;
  border-radius: 16px;
  padding: 16px 6px 8px 16px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  margin: ${({ isHorizontal }) => (isHorizontal ? '32px 0 0 0' : '0 0 24px 0')};

  &:before {
    content: '';
    position: absolute;
    top: ${({ isHorizontal }) => `${isHorizontal ? '-10px' : '20px'}`};
    left: ${({ isHorizontal }) => `${isHorizontal ? '20px' : '-10px'}`};
    width: 0;
    height: 0;

    border-top: ${({ isHorizontal }) => `${isHorizontal ? 0 : '10px solid transparent'}`};
    border-bottom: ${({ theme, isHorizontal }) =>
      `10px solid ${isHorizontal ? theme.colors.backgroundAlt : 'transparent'}`};
    border-right: ${({ theme, isHorizontal }) =>
      `10px solid ${isHorizontal ? 'transparent' : theme.colors.backgroundAlt}`};
    border-left: ${({ isHorizontal }) => `${isHorizontal ? '10px solid transparent' : 0}`};
  }
`

interface GameProps {
  isLatest?: boolean
  isHorizontal: boolean
}

interface CarouselProps {
  isHorizontal: boolean
}

const Carousel: React.FC<React.PropsWithChildren<CarouselProps>> = ({ isHorizontal }) => {
  const [swiper, setSwiper] = useState<SwiperClass | undefined>(undefined)

  return (
    <StyledSwiperContainer isHorizontal={isHorizontal}>
      <Swiper
        // loop
        resizeObserver
        slidesPerView={4}
        spaceBetween={10}
        // centeredSlides
        onSwiper={setSwiper}
      >
        <SwiperSlide>
          <StyledCarouselImage
            isHorizontal={isHorizontal}
            imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StyledCarouselImage
            isHorizontal={isHorizontal}
            imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StyledCarouselImage
            isHorizontal={isHorizontal}
            imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <StyledCarouselImage
            isHorizontal={isHorizontal}
            imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg"
          />
        </SwiperSlide>
      </Swiper>
      <Flex justifyContent="space-between" mt="10px">
        <ChevronLeftIcon cursor="pointer" width={24} height={24} />
        <ChevronRightIcon cursor="pointer" width={24} height={24} />
      </Flex>
    </StyledSwiperContainer>
  )
}

export const Game: React.FC<React.PropsWithChildren<GameProps>> = ({ isLatest, isHorizontal }) => {
  const { t } = useTranslation()

  return (
    <StyledGameContainer isHorizontal={isHorizontal}>
      {isLatest && (
        <Flex flexDirection="column" mb="32px">
          <Box margin="auto">
            <Image width={59} height={64} alt="flagship-game" src="/images/game/home/flagship-game.png" />
          </Box>
          <Flex justifyContent="center">
            <Text as="span" bold fontSize={['40px']} color="secondary">
              Flagship
            </Text>
            <Text as="span" ml="8px" bold fontSize={['40px']}>
              Game
            </Text>
          </Flex>
        </Flex>
      )}
      <Card>
        <Header />
        <StyledGameInfoContainer padding="0 32px 32px 32px">
          <Flex width="100%" justifyContent="space-between" paddingTop={['32px']}>
            <StyledLeftContainer width="100%">
              <StyledCarouselContainer isHorizontal={isHorizontal}>1233</StyledCarouselContainer>
              {isHorizontal && <Carousel isHorizontal={isHorizontal} />}
            </StyledLeftContainer>
            <StyledGameInformation>
              <Text mb="24px" bold fontSize={['40px']} lineHeight="110%">
                Pancake Protectors
              </Text>
              <Text mb="24px" bold fontSize={['24px']} color="secondary" lineHeight="110%">
                Unlock the Power of CAKE and Perks for Pancake Squad and Bunnies Holders
              </Text>
              <Text mb="24px" lineHeight="120%">
                PancakeSwap and Mobox joined forces to launch a tower-defense and PvP game tailored for GameFi players,
                as well as CAKE, Pancake Squad, and Bunnies holders.
              </Text>
              <Flex mb="24px" justifyContent="space-between">
                <StyledTag scale="xs" isPurple style={{ alignSelf: 'center' }}>
                  <Text fontSize={14}>Genera:</Text>
                  <Text fontSize={14} bold ml="4px">
                    Defense
                  </Text>
                </StyledTag>
                <Flex>
                  <Box>
                    <Text bold as="span" fontSize={12} color="textSubtle" textTransform="uppercase">
                      Published by
                    </Text>
                    <Text m="0 4px" bold as="span" fontSize={12} color="secondary" textTransform="uppercase">
                      dev_name
                    </Text>
                  </Box>
                  <Link external href="/">
                    <TelegramIcon color="secondary" />
                  </Link>
                </Flex>
              </Flex>
              <Link mb="49px" width="100% !important" external href="/">
                <Button width="100%">{t('Play Now')}</Button>
              </Link>

              {!isHorizontal && <Carousel isHorizontal={isHorizontal} />}

              <Box>
                <Text>TRENDING TAGS FOR THIS GAME:</Text>
                <StyledTagContainer>
                  <StyledTag scale="sm">PvP</StyledTag>
                  <StyledTag scale="sm">Strategy</StyledTag>
                  <StyledTag scale="sm">Pancake Squad</StyledTag>
                  <StyledTag scale="sm">Pancake Bunnies</StyledTag>
                  <StyledTag scale="sm">Tower Defense</StyledTag>
                </StyledTagContainer>
              </Box>
            </StyledGameInformation>
          </Flex>
        </StyledGameInfoContainer>
      </Card>
    </StyledGameContainer>
  )
}
