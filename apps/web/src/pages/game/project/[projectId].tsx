import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/games'
import { GamePageLayout } from 'views/Game/components/GamePageLayout'
import { GameProject } from 'views/Game/project'

const GameProjectPage = () => {
  return <GameProject />
}

GameProjectPage.Layout = GamePageLayout
GameProjectPage.chains = SUPPORTED_CHAIN_IDS

export default GameProjectPage
