import { websocket } from './webSocketClient'

function MarketStore() {
  let state = {}

  const store = {
    listeners: [],
    getState() {
      return state
    },
    dispatch(priceMap) {
      state = {
        ...state,
        ...priceMap,
      }
      this.listeners.forEach((fn) => fn.call(null, state))
    },
    subscribe(fn) {
      this.listeners.push(fn)
      return () => {
        const index = this.listeners.indexOf(fn)
        if (index >= 0) {
          this.listeners.splice(index, 1)
        }
      }
    },
  }

  return store
}

export const marketStore = MarketStore()

export function setupWs() {
  const wsClient = websocket('wss://stream.binance.com/stream?streams=bnbusdt@aggTrade')
  wsClient.onMessage((rs) => {
    console.log(rs)
    // marketStore.dispatch
  })
  wsClient.open()
}

export default {}
