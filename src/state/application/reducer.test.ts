import { ChainId } from '@pancakeswap/sdk'
import { createStore, Store } from 'redux'
import { updateBlockNumber } from './actions'
import reducer, { ApplicationState } from './reducer'

describe('application reducer', () => {
  let store: Store<ApplicationState>

  beforeEach(() => {
    store = createStore(reducer, {
      blockNumber: {
        [ChainId.MAINNET]: 3,
      },
    })
  })

  describe('updateBlockNumber', () => {
    it('updates block number', () => {
      store.dispatch(updateBlockNumber({ chainId: ChainId.MAINNET, blockNumber: 4 }))
      expect(store.getState().blockNumber[ChainId.MAINNET]).toEqual(4)
    })
    it('no op if late', () => {
      store.dispatch(updateBlockNumber({ chainId: ChainId.MAINNET, blockNumber: 2 }))
      expect(store.getState().blockNumber[ChainId.MAINNET]).toEqual(3)
    })
    it('works with non-set chains', () => {
      store.dispatch(updateBlockNumber({ chainId: ChainId.TESTNET, blockNumber: 2 }))
      expect(store.getState().blockNumber).toEqual({
        [ChainId.MAINNET]: 3,
        [ChainId.TESTNET]: 2,
      })
    })
  })
})
