import { createStore, Store } from 'redux'
import { DEFAULT_DEADLINE_FROM_NOW } from 'config/constants'
import { updateVersion } from '../global/actions'
import reducer, { initialState, UserState } from './reducer'

describe('swap reducer', () => {
  let store: Store<UserState>

  beforeEach(() => {
    store = createStore(reducer, initialState)
  })

  describe('updateVersion', () => {
    it('sets the userDeadline', () => {
      store.dispatch(updateVersion())
      expect(store.getState().userDeadline).toBeGreaterThanOrEqual(DEFAULT_DEADLINE_FROM_NOW)
    })
  })
})
