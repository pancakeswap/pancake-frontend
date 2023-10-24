import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/games'
import { GamePageLayout } from 'views/Game/components/GamePageLayout'
import { GameDevelopers } from 'views/Game/developers'

const GameDevelopersPage = () => {
  return <GameDevelopers />
}

GameDevelopersPage.Layout = GamePageLayout
GameDevelopersPage.chains = SUPPORTED_CHAIN_IDS

export default GameDevelopersPage
