export function getGameLink({ gameId, gameLink, isMobile }: { gameId: string; gameLink: string; isMobile?: boolean }) {
  return isMobile ? gameLink : `/project/${gameId}`
}
