export function isPositionOutOfRange(
  tickCurrent?: number,
  position?: { tickLower?: number; tickUpper?: number },
): boolean {
  return tickCurrent && position ? tickCurrent < position.tickLower || tickCurrent >= position.tickUpper : false
}
