export function isPositionOutOfRange(
  tickCurrent?: number,
  position?: { tickLower?: number; tickUpper?: number },
): boolean {
  return tickCurrent && position && position.tickLower && position.tickUpper
    ? tickCurrent < position.tickLower || tickCurrent >= position.tickUpper
    : false
}
