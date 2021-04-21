import { useCallback, useEffect, useRef, useState } from 'react'

// Only support specific token pairs until we find a method to validate token pairs
export enum TokenPair {
  BNBUSDT = 'bnbusdt',
}

/**
 * @see https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-ticker-streams
 */
export interface StreamData {
  e: string
  E: number
  s: string
  p: string
  P: string
  w: string
  x: string
  c: string
  Q: string
  b: string
  B: string
  a: string
  A: string
  o: string
  h: string
  l: string
  v: string
  q: string
  O: number
  C: number
  F: number
  L: number
  n: number
}

export interface TickerStream {
  eventType: string
  eventTime: number
  symbol: string
  priceChange: number
  priceChangePercent: number
  weightAveragePrice: number
  firstTrade: number
  lastPrice: number
  lastQuantity: number
  bestBidPrice: number
  bestBidQuantity: number
  bestAskPrice: number
  bestAskQuantity: number
  openPrice: number
  highPrice: number
  lowPrice: number
  totalTradedBaseAssetVolume: number
  totalTradedQuoteAssetVolume: number
  statisticsOpenTime: number
  statisticsCloseTime: number
  firstTradeId: number
  lastTradeId: number
  totalNumberOfTrades: number
}

export const useTokenPairTicker = (tokenPair: TokenPair, connectOnMount: boolean, retryCount = 3) => {
  const retriesRemaining = useRef(retryCount)

  // Chrome always returns an event code of 1006 so we have to keep track whether we closed the
  // connection manually or not (1000)
  const isManualClose = useRef(false)

  // Use a ref instead of state so we mark the connection as closed immediately without
  // triggering a re-render
  const isConnected = useRef(false)
  const [stream, setStream] = useState<TickerStream>(null)
  const websocket = useRef<WebSocket>(null)

  const connect = useCallback(() => {
    if (navigator.onLine && !isConnected.current) {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/streams/${tokenPair}@ticker`)

      ws.onopen = () => {
        isConnected.current = true
      }

      ws.onclose = () => {
        isConnected.current = false

        if (retriesRemaining.current > 0 && !isManualClose.current && !isConnected.current) {
          setTimeout(() => {
            connect()
            retriesRemaining.current -= 1
          }, 5000)
        }
      }

      ws.onerror = (error) => {
        console.error('Ticker:', error)
      }

      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data) as StreamData

          if (isConnected.current) {
            setStream({
              eventType: data.e,
              eventTime: data.E,
              symbol: data.s,
              priceChange: parseFloat(data.p),
              priceChangePercent: parseFloat(data.P),
              weightAveragePrice: parseFloat(data.w),
              firstTrade: parseFloat(data.x),
              lastPrice: parseFloat(data.c),
              lastQuantity: Number(data.Q),
              bestBidPrice: parseFloat(data.b),
              bestBidQuantity: Number(data.B),
              bestAskPrice: parseFloat(data.a),
              bestAskQuantity: Number(data.A),
              openPrice: parseFloat(data.o),
              highPrice: parseFloat(data.h),
              lowPrice: parseFloat(data.l),
              totalTradedBaseAssetVolume: Number(data.v),
              totalTradedQuoteAssetVolume: Number(data.q),
              statisticsOpenTime: Number(data.O),
              statisticsCloseTime: Number(data.C),
              firstTradeId: Number(data.F),
              lastTradeId: Number(data.L),
              totalNumberOfTrades: Number(data.n),
            })
          }
        } catch (error) {
          console.error(`Error parsing data from stream`, error)
        }
      }

      retriesRemaining.current = retryCount
      isManualClose.current = false
      websocket.current = ws
    }
  }, [websocket, tokenPair, isConnected, isManualClose, retriesRemaining, retryCount, setStream])

  const disconnect = useCallback(() => {
    isConnected.current = false
    isManualClose.current = true

    if (websocket.current) {
      websocket.current.close()
    }
  }, [isConnected, isManualClose, websocket])

  useEffect(() => {
    if (connectOnMount) {
      connect()
    }

    return () => disconnect()
  }, [websocket, connect, disconnect, connectOnMount, isConnected])

  return { stream, isConnected: isConnected.current, connect, disconnect }
}

// Token pair helpers
export const useBnbUsdtTicker = (connectOnMount = true) => {
  return useTokenPairTicker(TokenPair.BNBUSDT, connectOnMount)
}
