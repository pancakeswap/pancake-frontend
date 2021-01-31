import { useState, useEffect } from 'react'
import { marketStore } from 'utils/websocket-stream'

function useMarketTarde() {
  const [market, setMatket] = useState({ price: '', change: '' })

  useEffect(() => {
    return marketStore.subscribe(setMatket)
  }, [])

  return market
}

export default useMarketTarde
