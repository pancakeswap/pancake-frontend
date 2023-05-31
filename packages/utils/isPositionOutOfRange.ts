export function isPositionOutOfRange(
  tickCurrent?: number,
  position?: { tickLower?: number; tickUpper?: number },
): boolean {
  return (tickCurrent || tickCurrent === 0) &&
    position &&
    (position.tickLower || position.tickLower === 0) &&
    (position.tickUpper || position.tickUpper === 0)
    ? tickCurrent < position.tickLower || tickCurrent >= position.tickUpper
    : false
}
