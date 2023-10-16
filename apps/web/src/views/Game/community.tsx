import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { Banner } from 'views/Game/components/Community/Banner'
import { AllArticle } from 'views/Game/components/Community/AllArticle'
import { LIGHT_BG, DARK_BG } from 'views/Game/pageSectionStyles'

const StyledContainer = styled(Box)`
  background: ${({ theme }) => (theme.isDark ? DARK_BG : LIGHT_BG)};
`

export const GameCommunity = () => {
  return (
    <StyledContainer>
      <Banner />
      <AllArticle />
    </StyledContainer>
  )
}
