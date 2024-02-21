import { GameType } from '@pancakeswap/games'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, ChevronLeftIcon, ChevronRightIcon, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { GameCard } from 'components/Game/Community/Banner/GameCard'
import { Decorations } from 'components/Game/Decorations'
import { useGamesConfig } from 'hooks/useGamesConfig'
import NextLink from 'next/link'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getGameLink } from 'utils/getGameLink'

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
  display: none;
  align-self: center;
  justify-content: center;
  align-items: center;
  width: 32px;
  min-width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  svg path {
    fill: ${({ theme }) => theme.colors.primary};
  }
  cursor: pointer;

  &.swiper-button-disabled {
    opacity: 0;
    pointer-events: none;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    display: flex;
  }
`

const StyledSwiperContainer = styled(Box)`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: calc(100% - 141px);
  }
`

export const Banner = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isDesktop, isMobile } = useMatchBreakpoints()

  const config = useGamesConfig()
  const games: GameType[] = useMemo(() => config.slice(0, 6), [config])

  return (
    <StyledBackground>
      <StyledGradientBg />
      {games.length > 0 && <Decorations />}
      <Flex position="relative" zIndex="1" margin="auto" flexDirection="column" alignItems="center">
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
        <Box margin="auto" width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}>
          {games.length > 0 && (
            <Flex width="100%">
              {games.length > 3 && (
                <ArrowButton className="prev" style={{ marginRight: '32px' }}>
                  <ChevronLeftIcon color={theme.colors.textSubtle} />
                </ArrowButton>
              )}
              <StyledSwiperContainer>
                <Swiper
                  resizeObserver
                  slidesPerView={1}
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
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                    },
                    920: {
                      slidesPerView: 2,
                      spaceBetween: 32,
                      autoplay: false,
                    },
                    1440: {
                      slidesPerView: 3,
                      spaceBetween: 32,
                      autoplay: false,
                    },
                  }}
                >
                  {games.map((game) => (
                    <SwiperSlide key={game.id}>
                      <NextLink passHref href={getGameLink({ gameId: game.id, isMobile, gameLink: game.gameLink })}>
                        <GameCard game={game} />
                      </NextLink>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </StyledSwiperContainer>
              {games.length > 1 && (
                <ArrowButton className="next" style={{ marginLeft: '32px' }}>
                  <ChevronRightIcon color={theme.colors.textSubtle} />
                </ArrowButton>
              )}
            </Flex>
          )}
        </Box>
      </Flex>
    </StyledBackground>
  )
}
