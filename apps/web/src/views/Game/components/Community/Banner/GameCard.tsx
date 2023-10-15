import { Box, BoxProps, Card, Flex, Text } from '@pancakeswap/uikit'
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

interface GameCardProps extends BoxProps {
  imgUrl: string
  // article?: ArticleDataType
  imgHeight?: HeightProps['height']
}

export const GameCard: React.FC<React.PropsWithChildren<GameCardProps>> = ({ imgUrl, imgHeight, ...props }) => {
  return (
    <StyledGameCard {...props}>
      <Card>
        <Box overflow="hidden" height={imgHeight ?? '200px'}>
          <StyledBackgroundImage imgUrl={imgUrl} />
        </Box>
        <Box padding="20px">
          <Text color="textSubtle" mb="8px" bold fontSize={['12px']} lineHeight="120%">
            Mobox
          </Text>
          <Text mb="24px" bold fontSize={['20px']} lineHeight="22px">
            Pancake Protectors
          </Text>
        </Box>
      </Card>
    </StyledGameCard>
  )
}
