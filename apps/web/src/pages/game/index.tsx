import { GamePageLayout } from 'views/Game/components/GamePageLayout'
import { GameHomePage } from 'views/Game/index'

const GamePage = () => {
  return <GameHomePage />
}

GamePage.Layout = GamePageLayout
GamePage.chains = []

export default GamePage
