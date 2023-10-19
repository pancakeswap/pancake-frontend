import { GamePageLayout } from 'views/Game/components/GamePageLayout'
import { GameProject } from 'views/Game/project'

const GameProjectPage = () => {
  return <GameProject />
}

GameProjectPage.Layout = GamePageLayout
GameProjectPage.chains = []

export default GameProjectPage
