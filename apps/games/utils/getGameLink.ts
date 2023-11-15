export function getGameLink({ gameId, isMobile }: { gameId: string; isMobile?: boolean }) {
  return gameId === 'pancake-protectors' && isMobile ? 'https://protectors.pancakeswap.finance' : `/project/${gameId}`
}
