import { MANAGER, VERIFIED_MANAGERS } from '../constants/managers'

export function isManagerVerified(manager: MANAGER) {
  return VERIFIED_MANAGERS.includes(manager)
}

export * from './pcs'
