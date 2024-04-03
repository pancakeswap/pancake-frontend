import { GameType } from '@pancakeswap/games'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Card, CardHeader, ChevronLeftIcon, ChevronRightIcon, Flex, Text } from '@pancakeswap/uikit'
import { StyledTextLineClamp } from 'components/Game/StyledTextLineClamp'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import { styled } from 'styled-components'
import { Navigation } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'

import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

const StyledCard = styled(Box)<{ picked?: boolean }>`
  position: relative;
  width: 300px;
  margin-bottom: 0;

  &:before {
    display: none;
    content: '';
    z-index: 1;
    position: absolute;
    bottom: -12px;
    left: 50%;
    width: 0px;
    height: 0px;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    transform: translateX(-50%);
    border-top: ${({ theme }) => `15px solid ${theme.colors.backgroundAlt}`};
  }

    ${({ theme }) => theme.mediaQueries.sm} {
      margin-bottom: 15px;

      &:before {
        display: ${({ picked }) => (picked ? 'block' : 'none')};
      }
    }
  }
`

const StyledSwiper = styled(Swiper)`
  position: relative;
  max-width: 298px;
  margin: 0 auto 20px auto;
  overflow: hidden;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 630px; // 2 swiper
    margin: 0 auto 85px auto;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    max-width: 945px; // 3 swiper
  }
`

const Header = styled(CardHeader)<{ imgUrl: string }>`
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
  background-image: ${({ imgUrl }) => `url('${imgUrl}')`};

  ${({ theme }) => theme.mediaQueries.md} {
    height: 200px;
  }
`

const ProjectLogo = styled(Box)<{ imgUrl: string }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 80px;
  height: 27px;
  background-repeat: no-repeat;
  background-size: contain;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-image: ${({ imgUrl }) => `url('${imgUrl}')`};
`

const StyledTag = styled(Button)`
  font-weight: 400;
  width: fit-content;
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.secondary};

  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
    align-self: center;
  }
`
const ArrowButton = styled.div`
  display: flex;
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
`

interface GamesProps {
  otherGames: GameType[]
  pickedGameId: string
  setPickedGameId: (id: string) => void
}

export const Games: React.FC<React.PropsWithChildren<GamesProps>> = ({ otherGames, pickedGameId, setPickedGameId }) => {
  const { t } = useTranslation()
  const { theme, isDark } = useTheme()

  const getTime = useCallback((timestamp: number) => {
    const timeToMilliseconds = timestamp * 1000
    return dayjs(timeToMilliseconds).format('MM/DD/YYYY')
  }, [])

  const handleRealIndexChange = useCallback(
    (swiperInstance: SwiperClass) => {
      const getPickedGameId = otherGames[swiperInstance.realIndex].id
      setPickedGameId(getPickedGameId)
    },
    [otherGames, setPickedGameId],
  )

  return (
    <Flex maxWidth="1100px" margin="auto">
      <ArrowButton className="prev">
        <ChevronLeftIcon color={theme.colors.textSubtle} />
      </ArrowButton>
      <StyledSwiper
        slidesPerView={1}
        spaceBetween={10}
        modules={[Navigation]}
        navigation={{
          prevEl: '.prev',
          nextEl: '.next',
        }}
        resizeObserver
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          860: {
            slidesPerView: 2,
            spaceBetween: 34,
          },
          1440: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        }}
        onRealIndexChange={handleRealIndexChange}
      >
        {otherGames?.map((game) => (
          <SwiperSlide key={game.id} onClick={() => setPickedGameId(game.id)}>
            <StyledCard picked={game.id === pickedGameId}>
              <Card>
                <Header imgUrl={game.headerImage} />
                <Box padding="20px">
                  <StyledTextLineClamp lineClamp={2} bold fontSize={20} lineHeight="110%">
                    {game.title}
                  </StyledTextLineClamp>
                  <StyledTextLineClamp lineClamp={3} m="20px 0" fontSize={12} color="textSubtle" lineHeight="120%">
                    {game.description}
                  </StyledTextLineClamp>
                  <Box>
                    <Text fontSize={12} color="textSubtle" bold>
                      {t('Publish Date: %date%', { date: getTime(game.publishDate) })}
                    </Text>
                    <Text fontSize={12} color="textSubtle" bold mb="20px">
                      {t('Publisher:')}
                    </Text>
                    <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent="space-between">
                      <ProjectLogo imgUrl={isDark ? game.projectLogo.darkTheme : game.projectLogo.lightTheme} />
                      <StyledTag scale="xs">{game.genre}</StyledTag>
                    </Flex>
                  </Box>
                </Box>
              </Card>
            </StyledCard>
          </SwiperSlide>
        ))}
      </StyledSwiper>
      <ArrowButton className="next">
        <ChevronRightIcon color={theme.colors.textSubtle} />
      </ArrowButton>
    </Flex>
  )
}
