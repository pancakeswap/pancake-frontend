import { Box, BoxProps, Card, Text, Flex, Link, DiscordIcon, TelegramIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { styled, useTheme } from 'styled-components'
import { GameType } from '@pancakeswap/games'

const StyledBackgroundImage = styled(Box)<{ imgUrl: string }>`
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const StyledGameCard = styled(Box)`
  cursor: pointer;
`

const StyledCircleLogo = styled(Box)<{ imgUrl: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: -28px auto 0 auto;
  border: ${({ theme }) => ` solid 1.2px ${theme.colors.cardBorder}`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  background-image: ${({ imgUrl }) => `url(${imgUrl})`};
`

const CircleButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  svg path {
    fill: #fff;
  }
`

interface GameCardProps extends BoxProps {
  game: GameType
}

export const GameCard: React.FC<React.PropsWithChildren<GameCardProps>> = ({ game, ...props }) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const telegram = game?.socialMedia?.telegram ?? ''
  const discord = game?.socialMedia?.discord ?? ''

  return (
    <StyledGameCard {...props}>
      <Card>
        <Box overflow="hidden" height={['134px', '134px', '134px', '134px', '200px']}>
          <StyledBackgroundImage imgUrl={game.headerImage} />
        </Box>
        <StyledCircleLogo imgUrl={isDark ? game.projectCircleLogo.darkTheme : game.projectCircleLogo.lightTheme} />
        <Box padding={['11px', '11px', '11px', '11px', '20px']}>
          <Text bold mb="8px" lineHeight="120%" color="textSubtle" fontSize={['12px']}>
            {game.projectName}
          </Text>
          <Text bold fontSize={['20px']} lineHeight="22px" mb={['16px', '16px', '16px', '16px', '24px']}>
            {game.title}
          </Text>
          <Box onClick={(e) => e.stopPropagation()}>
            {discord && (
              <Flex mb="16px">
                <Link external href={discord}>
                  <CircleButton>
                    <DiscordIcon />
                  </CircleButton>
                  <Text ml="8px" bold style={{ alignSelf: 'center' }}>
                    {t('Discord')}
                  </Text>
                </Link>
              </Flex>
            )}
            {telegram && (
              <Flex>
                <Link external href={telegram}>
                  <CircleButton>
                    <TelegramIcon />
                  </CircleButton>
                  <Text ml="8px" bold style={{ alignSelf: 'center' }}>
                    {t('Telegram')}
                  </Text>
                </Link>
              </Flex>
            )}
          </Box>
        </Box>
      </Card>
    </StyledGameCard>
  )
}
