import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/games'
import { GamePageLayout } from 'views/Game/components/GamePageLayout'
import { GameHomePage } from 'views/Game/index'

const GamePage = () => {
  return <GameHomePage />
}

GamePage.Layout = GamePageLayout
GamePage.chains = SUPPORTED_CHAIN_IDS

export default GamePage
