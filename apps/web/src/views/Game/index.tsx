import { styled } from 'styled-components'
import { Box } from '@pancakeswap/uikit'
import { LIGHT_BG, DARK_BG } from 'views/Game/pageSectionStyles'
import { Decorations } from 'views/Game/components/Decorations'
import { Banner } from 'views/Game/components/Home/Banner'
import { Game } from 'views/Game/components/Home/Game'
import { OtherGames } from 'views/Game/components/Home/OtherGames'

const StyledBackground = styled(Box)`
  padding: 32px 16px 32px 16px;
  background: ${({ theme }) => (theme.isDark ? DARK_BG : LIGHT_BG)};

  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 56px 0 82px 0;
  }
`

export const GameHomePage = () => {
  return (
    <>
      <Banner />
      <Decorations />
      <StyledBackground>
        <Game isLatest isHorizontal={false} />
      </StyledBackground>
      <OtherGames />
    </>
  )
}
