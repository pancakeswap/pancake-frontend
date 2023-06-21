export function isPositionOutOfRange(
  tickCurrent?: number,
  position?: { tickLower?: number; tickUpper?: number },
): boolean {
  return typeof tickCurrent === 'number' &&
    position &&
    typeof position?.tickLower === 'number' &&
    typeof position?.tickUpper === 'number'
    ? tickCurrent < position.tickLower || tickCurrent >= position.tickUpper
    : false
}
