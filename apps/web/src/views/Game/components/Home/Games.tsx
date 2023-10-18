import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Box, Text, Button, CardHeader, Card } from '@pancakeswap/uikit'

const StyledCard = styled(Box)<{ picked?: boolean }>`
  position: relative;
  width: 300px;

  &:before {
    display: ${({ picked }) => (picked ? 'blokc' : 'none')};
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

const StyledTextLineClamp = styled(Text)<{ lineClamp: number }>`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ lineClamp }) => lineClamp};
`

export const Games = () => {
  const { t } = useTranslation()
  return (
    <StyledContainer>
      {[1, 2].map((i) => (
        <StyledCard picked={i === 1}>
          <Card>
            <Header imgUrl="/images/ifos/sable-bg.png" />
            <Box padding="20px">
              <StyledTextLineClamp lineClamp={2} bold fontSize={20} lineHeight="110%">
                Pancake Mayor Name of the game or promotion title here
              </StyledTextLineClamp>
              <StyledTextLineClamp lineClamp={3} m="20px 0" fontSize={12} color="textSubtle" lineHeight="120%">
                Brief extract Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                ut labore et dolore magna alere... 140 character max.
              </StyledTextLineClamp>
              <Box>
                <Text fontSize={12} color="textSubtle" bold>
                  {t('Publish Date: %date%', { date: 'MM DD, YYYY' })}{' '}
                </Text>
                <Text fontSize={12} color="textSubtle" bold mb="20px">
                  {t('Publisher:')}
                </Text>
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
