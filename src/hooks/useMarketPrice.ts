import { useState, useEffect } from 'react'
import { marketStore } from 'utils/websocket-stream/store'

export function useMarketPrice() {
  const [market, setMatket] = useState('')

  useEffect(() => {
    return marketStore.subscribe((rs) => {
      setMatket(Number(rs.marketPrice).toFixed(4))
    })
  }, [])

  return market
}

export default {}
