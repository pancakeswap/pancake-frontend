import { createStore, Store } from '@reduxjs/toolkit'
import { updateVersion } from '../global/actions'
import reducer, { initialState, UserState } from './reducer'

describe('swap reducer', () => {
  let store: Store<UserState>

  beforeEach(() => {
    store = createStore(reducer, initialState)
  })

  describe('updateVersion', () => {
    it('has no timestamp originally', () => {
      expect(store.getState().lastUpdateVersionTimestamp).toBeUndefined()
    })
    it('sets the lastUpdateVersionTimestamp', () => {
      const time = Date.now()
      store.dispatch(updateVersion())
      expect(store.getState().lastUpdateVersionTimestamp).toBeGreaterThanOrEqual(time)
    })
  })
})
