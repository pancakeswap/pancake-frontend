import { BIG_ZERO } from '../utils/bigNumber'
import { UPDATE_ZOMBIE_ALLOWANCE } from './actionTypes'

const defaultState = {
  zombieAllowance: BIG_ZERO,
}

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_ZOMBIE_ALLOWANCE:
      return {
        ...state,
        zombieAllowance: action.payload.zombieAllowance,
      }
    default:
      return state
  }
}