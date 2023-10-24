import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/games'
import { GamePageLayout } from 'views/Game/components/GamePageLayout'
import { GameCommunity } from 'views/Game/community'

const GameCommunityPage = () => {
  return <GameCommunity />
}

GameCommunityPage.Layout = GamePageLayout
GameCommunityPage.chains = SUPPORTED_CHAIN_IDS

export default GameCommunityPage
