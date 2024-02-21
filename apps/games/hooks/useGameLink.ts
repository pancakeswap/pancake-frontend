import { GameLinkType } from '@pancakeswap/games'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { getGameLink } from 'utils/getGameLink'

export function useGameLink(gameId: string, gameLink: GameLinkType) {
  const { isMobile } = useMatchBreakpoints()

  return useMemo(() => getGameLink({ gameId, isMobile, gameLink }), [isMobile, gameId, gameLink])
}
