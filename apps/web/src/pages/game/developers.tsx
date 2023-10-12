import { GamePageLayout } from 'views/Game/components/GamePageLayout'
import { GameDevelopers } from 'views/Game/developers'

const GameDevelopersPage = () => {
  return <GameDevelopers />
}

GameDevelopersPage.Layout = GamePageLayout
GameDevelopersPage.chains = []

export default GameDevelopersPage
