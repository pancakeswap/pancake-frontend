import { websocket } from './webSocketClient'
import { marketStore } from './store'

const priceCache = {
  price: '',
}

let timeId
function schedule() {
  timeId = setTimeout(() => {
    marketStore.dispatch({
      marketPrice: priceCache.price,
    })
    // TODO
    schedule()
  }, 1000)
}

export function setupWs() {
  const wsClient = websocket('wss://stream.binance.com/stream?streams=bnbusdt@aggTrade')
  wsClient.onMessage((rs) => {
    const payload = JSON.parse(rs.data)
    priceCache.price = payload.data.p
  })
  wsClient.open()
  schedule()
  return () => {
    if (timeId) {
      clearTimeout(timeId)
    }
    wsClient.close()
  }
}

export default {}
