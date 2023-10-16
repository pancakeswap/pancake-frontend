import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { Banner } from 'views/Game/components/Community/Banner'
import { AllArticle } from 'views/Game/components/Community/AllArticle'

const StyledContainer = styled(Box)`
  background: ${({ theme }) =>
    theme.isDark
      ? 'radial-gradient(105.94% 70.71% at 50% 50%, #21193A 0%, #191326 100%)'
      : 'linear-gradient(180deg, #FFF 0%, #FAF9FA 48.15%, #D7CAEC 100%)'};
`

export const GameCommunity = () => {
  return (
    <StyledContainer>
      <Banner />
      <AllArticle />
    </StyledContainer>
  )
}
