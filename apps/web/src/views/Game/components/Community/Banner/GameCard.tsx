import { Box, BoxProps, Card, Text } from '@pancakeswap/uikit'
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

interface GameCardProps extends BoxProps {
  id: any // delete
  imgUrl: string
  // article?: ArticleDataType
  imgHeight?: HeightProps['height']
}

export const GameCard: React.FC<React.PropsWithChildren<GameCardProps>> = ({ id, imgUrl, imgHeight, ...props }) => {
  return (
    <StyledGameCard {...props}>
      <Card>
        <Box overflow="hidden" height={imgHeight ?? '200px'}>
          <StyledBackgroundImage imgUrl={imgUrl} />
        </Box>
        <StyledLogo imgUrl="https://sgp1.digitaloceanspaces.com/strapi.space/57b10f498f5c9c518308b32a33f11539.jpg" />
        <Box padding="20px">
          <Text color="textSubtle" mb="8px" bold fontSize={['12px']} lineHeight="120%">
            Mobox
          </Text>
          <Text mb="24px" bold fontSize={['20px']} lineHeight="22px">
            Pancake Protectors {id}
          </Text>
        </Box>
      </Card>
    </StyledGameCard>
  )
}
