import { GamePageLayout } from 'views/Game/components/GamePageLayout'
import { GameCommunity } from 'views/Game/community'

const GameCommunityPage = () => {
  return <GameCommunity />
}

GameCommunityPage.Layout = GamePageLayout
GameCommunityPage.chains = []

export default GameCommunityPage
