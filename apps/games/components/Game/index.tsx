import { GameType } from '@pancakeswap/games'
import { Box } from '@pancakeswap/uikit'
import { Decorations } from 'components/Game/Decorations'
import { Banner } from 'components/Game/Home/Banner'
import { Game } from 'components/Game/Home/Game'
import { OtherGames } from 'components/Game/Home/OtherGames'
import { DARK_BG, LIGHT_BG } from 'components/Game/pageSectionStyles'
import { useGamesConfig } from 'hooks/useGamesConfig'
import { useMemo } from 'react'
import { styled } from 'styled-components'

const StyledBackground = styled(Box)`
  padding: 32px 16px 32px 16px;
  background: ${({ theme }) => (theme.isDark ? DARK_BG : LIGHT_BG)};

  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 56px 0 82px 0;
  }
`

export const GameHomePage = () => {
  const config = useGamesConfig()
  const latestGame: GameType = useMemo(() => config.slice(0, 1)?.[0], [config])
  const otherGames: GameType[] = useMemo(() => config.slice(1), [config])

  return (
    <>
      <Banner />
      <Decorations />
      <StyledBackground>
        <Game isLatest game={latestGame} />
      </StyledBackground>
      {otherGames.length > 0 && <OtherGames otherGames={otherGames} />}
    </>
  )
}
