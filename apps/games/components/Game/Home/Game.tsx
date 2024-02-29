import { GameType, PostersItemData, PostersLayout } from '@pancakeswap/games'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Card, CardHeader, Flex, Link, TelegramIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Carousel } from 'components/Game/Home/Carousel'
import { CarouselView } from 'components/Game/Home/CarouselView'
import { StyledTag, TrendingTags } from 'components/Game/Home/TrendingTags'
import { StyledTextLineClamp } from 'components/Game/StyledTextLineClamp'
import { useGameLink } from 'hooks/useGameLink'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'

const StyledGameContainer = styled(Flex)<{ isHorizontal: boolean }>`
  width: 100%;
  margin: auto;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: ${({ isHorizontal }) => (isHorizontal ? '1101px' : '948px')};
  }
`

const StyledGameInfoContainer = styled(Box)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const StyledGameInformation = styled(Flex)`
  width: 100%;
  flex: 2;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 32px;
    width: 467px;
  }
`

const Header = styled(CardHeader)<{ imgUrl: string }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 67px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  background-image: ${({ imgUrl }) => `url('${imgUrl}')`};
  ${({ theme }) => theme.mediaQueries.sm} {
    height: 112px;
  }
`

const StyledLeftContainer = styled(Flex)<{ isHorizontal: boolean }>`
  width: 100%;
  flex: 1;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: ${({ isHorizontal }) => (isHorizontal ? '671px' : '392px')};
  }
`

const StyledHeaderIconImage = styled(Box)<{ imgUrl: string }>`
  position: absolute;
  width: 107px;
  height: 87px;
  top: -1.4%;
  right: 16px;
  z-index: 1;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: ${({ imgUrl }) => `url('${imgUrl}')`};

  ${({ theme }) => theme.mediaQueries.sm} {
    top: 1.7%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    top: -31px;
    width: 358px;
    height: 145px;
  }
`

interface GameProps {
  isLatest?: boolean
  game: GameType
}

export const Game: React.FC<React.PropsWithChildren<GameProps>> = ({ isLatest, game }) => {
  const { t } = useTranslation()
  const { isDesktop, isLg, isXxl } = useMatchBreakpoints()
  const [carouselId, setCarouselId] = useState(0)

  const carouselData: PostersItemData[] = useMemo(() => game.posters.items, [game])
  const previewCarouseData: PostersItemData = useMemo(() => carouselData[carouselId], [carouselId, carouselData])

  const isHorizontal: boolean = useMemo(() => game.posters.layout === PostersLayout.Horizontal, [game])
  const gameLink = useGameLink(game.id, game.gameLink)

  return (
    <StyledGameContainer isHorizontal={isHorizontal}>
      {isLatest && isDesktop && game.id === 'pancake-protectors' && (
        <Flex flexDirection="column" mb="32px">
          <Box margin="auto">
            <Image width={59} height={64} alt="flagship-game" src="/images/game/home/flagship-game.png" />
          </Box>
          <Flex justifyContent="center">
            <Text as="span" bold fontSize={['40px']} color="secondary">
              {t('Flagship')}
            </Text>
            <Text as="span" ml="8px" bold fontSize={['40px']}>
              {t('Game')}
            </Text>
          </Flex>
        </Flex>
      )}
      <Box position="relative">
        {game?.headerIconImage && (
          <StyledHeaderIconImage
            imgUrl={isLg || isDesktop ? game.headerIconImage.desktop : game.headerIconImage.mobile}
          />
        )}
        <Card>
          <Header imgUrl={game.headerImage} />
          <StyledGameInfoContainer
            padding={[
              '0 20px 20px 20px',
              '0 20px 20px 20px',
              '0 20px 20px 20px',
              '0 20px 20px 20px',
              '0 32px 32px 32px',
            ]}
          >
            <Flex
              width="100%"
              paddingTop={['32px']}
              justifyContent="space-between"
              flexDirection={[
                'column-reverse',
                'column-reverse',
                'column-reverse',
                'column-reverse',
                'column-reverse',
                'row',
              ]}
            >
              <StyledLeftContainer isHorizontal={isHorizontal}>
                <Box height="100%" mb={['16px', '16px', '16px', '16px', '16px', '0']}>
                  <CarouselView isHorizontal={isHorizontal} carouselData={previewCarouseData} />
                  {((!isHorizontal && !isXxl) || isHorizontal) && (
                    <Carousel
                      carouselId={carouselId}
                      carouselData={carouselData}
                      isHorizontal={isHorizontal}
                      setCarouselId={setCarouselId}
                    />
                  )}
                </Box>
                {!isXxl && <TrendingTags trendingTags={game.trendingTags} />}
              </StyledLeftContainer>
              <StyledGameInformation>
                <Text bold lineHeight="110%" fontSize={['32px', '32px', '32px', '32px', '32px', '40px']}>
                  {game.title}
                </Text>
                <StyledTextLineClamp
                  bold
                  lineClamp={2}
                  color="secondary"
                  lineHeight="110%"
                  fontSize={['20px', '20px', '20px', '20px', '20px', '24px']}
                  m={['12px 0', '12px 0', '12px 0', '12px 0', '12px 0', '24px 0']}
                >
                  {game.subTitle}
                </StyledTextLineClamp>
                <StyledTextLineClamp
                  lineClamp={3}
                  lineHeight="120%"
                  mb={['32px', '32px', '32px', '32px', '32px', '24px']}
                >
                  {game.description}
                </StyledTextLineClamp>
                <Flex
                  flexDirection={['column', 'row']}
                  justifyContent={['flex-start', 'space-between']}
                  mb={['32px', '32px', '32px', '32px', '32px', '24px']}
                >
                  <Flex alignSelf={['flex-start', 'center']}>
                    <StyledTag scale="xs" $isPurple style={{ width: 'fit-content' }}>
                      <Text fontSize={14} color="white">
                        {t('Genre:')}
                      </Text>
                      <Text fontSize={14} bold ml="4px" color="white">
                        {game.genre}
                      </Text>
                    </StyledTag>
                  </Flex>
                  <Flex mt={['10px', '0']}>
                    <Flex alignSelf={['center']} flexDirection={['row', 'column']} mr="4px">
                      <Text
                        bold
                        fontSize={12}
                        lineHeight="120%"
                        color="textSubtle"
                        textTransform="uppercase"
                        textAlign="right"
                      >
                        {t('Published By')}
                      </Text>
                      <Text
                        bold
                        fontSize={12}
                        color="secondary"
                        lineHeight="120%"
                        textTransform="uppercase"
                        textAlign="right"
                        ml={['4px', '0']}
                      >
                        {game.projectName}
                      </Text>
                    </Flex>
                    {game?.socialMedia?.telegram && (
                      <Link external href={game.socialMedia.telegram}>
                        <TelegramIcon color="secondary" />
                      </Link>
                    )}
                  </Flex>
                </Flex>
                <Link
                  width="100% !important"
                  href={gameLink}
                  external={game?.gameLink?.external}
                  mb={['32px', '32px', '32px', '32px', '32px', '49px']}
                >
                  <Button width="100%">
                    <Text bold color="white">
                      {game?.gameLink?.signUpLink && !game.gameLink.playNowLink ? t('Sign Up') : t('Play Now')}
                    </Text>
                  </Button>
                </Link>

                {isXxl && !isHorizontal && (
                  <Carousel
                    carouselId={carouselId}
                    carouselData={carouselData}
                    isHorizontal={isHorizontal}
                    setCarouselId={setCarouselId}
                  />
                )}

                {isXxl && <TrendingTags trendingTags={game.trendingTags} />}
              </StyledGameInformation>
            </Flex>
          </StyledGameInfoContainer>
        </Card>
      </Box>
    </StyledGameContainer>
  )
}
