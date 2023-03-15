import { PositionDetails } from '@pancakeswap/farms'
import { Pool, Position } from '@pancakeswap/v3-sdk'

export function isPositionOutOfRange(pool?: Pool, position?: Position | PositionDetails): boolean {
  return pool && position ? pool.tickCurrent < position.tickLower || pool.tickCurrent >= position.tickUpper : false
}
