import { Box, BoxProps, Card, Text, Flex, Link, DiscordIcon, TelegramIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { HeightProps } from 'styled-system'

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

const StyledLogo = styled(Box)<{ imgUrl: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: -28px auto 0 auto;
  border: ${({ theme }) => ` solid 1.2px ${theme.colors.cardBorder}`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  id: any // delete
  imgUrl: string
  // article?: ArticleDataType
  imgHeight?: HeightProps['height']
}

export const GameCard: React.FC<React.PropsWithChildren<GameCardProps>> = ({ id, imgUrl, imgHeight, ...props }) => {
  const { t } = useTranslation()

  return (
    <StyledGameCard {...props}>
      <Card>
        <Box overflow="hidden" height={imgHeight ?? '200px'}>
          <StyledBackgroundImage imgUrl={imgUrl} />
        </Box>
        <StyledLogo imgUrl="https://assets.pancakeswap.finance/web/chains/56.png" />
        <Box padding="20px">
          <Text color="textSubtle" mb="8px" bold fontSize={['12px']} lineHeight="120%">
            Mobox
          </Text>
          <Text mb="24px" bold fontSize={['20px']} lineHeight="22px">
            Pancake Protectors {id}
          </Text>
          <Box>
            <Flex mb="16px">
              <Link external href="/">
                <CircleButton>
                  <DiscordIcon />
                </CircleButton>
                <Text ml="8px" bold style={{ alignSelf: 'center' }}>
                  {t('Discord')}
                </Text>
              </Link>
            </Flex>
            <Flex>
              <Link external href="/">
                <CircleButton>
                  <TelegramIcon />
                </CircleButton>
                <Text ml="8px" bold style={{ alignSelf: 'center' }}>
                  {t('Telegram')}
                </Text>
              </Link>
            </Flex>
          </Box>
        </Box>
      </Card>
    </StyledGameCard>
  )
}
