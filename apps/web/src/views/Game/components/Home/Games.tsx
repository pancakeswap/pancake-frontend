import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Box, Text, Button, CardHeader, Card } from '@pancakeswap/uikit'

const StyledCard = styled(Box)`
  position: relative;
  width: 300px;

  // &:before {
  //   content: '';
  //   position: absolute;
  //   bottom: -15px;
  //   left: 50%;
  //   width: 0px;
  //   height: 0px;
  //   border-right: 15px solid transparent;
  //   border-left: 15px solid transparent;
  //   border-top: ${({ theme }) => `15px solid ${theme.colors.backgroundAlt}`};
  //   transform: translateX(-50%);
  // }
`

const StyledContainer = styled(Flex)`
  margin-bottom: 85px;
  justify-content: center;

  ${StyledCard} {
    margin-right: 34px;

    &:last-child {
      margin: 0;
    }
  }
`

const Header = styled(CardHeader)<{ imgUrl: string }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 200px;
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

const HorizontalLogo = styled(Box)<{ imgUrl: string }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 73px;
  height: 27px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-image: ${({ imgUrl }) => `url('${imgUrl}')`};
`

const StyledTag = styled(Button)`
  font-weight: 400;
  align-self: center;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.secondary};
`

export const Games = () => {
  const { t } = useTranslation()
  return (
    <StyledContainer>
      {[1, 2].map((i) => (
        <StyledCard>
          <Card>
            <Header imgUrl="/images/ifos/sable-bg.png" />
            <Box padding="20px">
              <Text>Pancake Mayor Name of the game or promotion title here</Text>
              <Text mb="20px">
                Brief extract Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                ut labore et dolore magna alere... 140 character max.
              </Text>
              <Box>
                <Text>Publish Date: MM DD, YYYY</Text>
                <Text mb="20px">Publisher:</Text>
                <Flex justifyContent="space-between">
                  <HorizontalLogo imgUrl="/images/ifos/sable-bg.png" />
                  <StyledTag scale="xs">Casual</StyledTag>
                </Flex>
              </Box>
            </Box>
          </Card>
        </StyledCard>
      ))}
    </StyledContainer>
  )
}
