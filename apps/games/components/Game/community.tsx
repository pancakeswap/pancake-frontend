import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { Banner } from 'components/Game/Community/Banner'
import { AllArticle } from 'components/Game/Community/AllArticle'
import { LIGHT_BG, DARK_BG } from 'components/Game/pageSectionStyles'

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
