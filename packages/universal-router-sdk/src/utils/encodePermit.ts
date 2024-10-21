import { Permit2Signature } from '../entities/types'
import { CommandType } from '../router.types'
import { RoutePlanner } from './RoutePlanner'

export function encodePermit(planner: RoutePlanner, permit2: Permit2Signature): void {
  planner.addCommand(CommandType.PERMIT2_PERMIT, [permit2, permit2.signature as `0x${string}`])
}
