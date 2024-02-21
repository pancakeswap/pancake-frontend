import { GameLinkType } from '@pancakeswap/games'

export function getGameLink({
  gameId,
  gameLink,
  isMobile,
}: {
  gameId: string
  gameLink: GameLinkType
  isMobile?: boolean
}) {
  if (gameLink.signUpLink && !gameLink.playNowLink) {
    return gameLink.signUpLink
  }

  return isMobile ? gameLink.playNowLink : `/project/${gameId}`
}
