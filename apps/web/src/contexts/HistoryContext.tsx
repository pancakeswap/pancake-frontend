import { useRouter } from 'next/router'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

interface HistoryManagerContext {
  history: string[]
  canGoBack: () => boolean
  subscribe: (subscriber: Subscriber) => void
  unsubscribe: (subscriber: Subscriber) => void
}

interface Subscriber {
  setState: React.Dispatch<React.SetStateAction<any>>
}

const historyManagerContext = createContext<HistoryManagerContext | null>(null)

export function HistoryManagerProvider({ children }: { children: React.ReactNode }) {
  const value = useHistoryManager()
  return <historyManagerContext.Provider value={value}>{children}</historyManagerContext.Provider>
}

export const useHistory = () => {
  const context = useContext(historyManagerContext)
  if (!context) {
    throw new Error('useHistory must be used within a HistoryManagerProvider')
  }

  const [, setState] = useState()

  useEffect(() => {
    const subscriber = { setState }
    context.subscribe(subscriber)

    return () => {
      context.unsubscribe(subscriber)
    }
  }, [context])

  return context
}

function useHistoryManager(): HistoryManagerContext {
  const router = useRouter()
  const [history, setHistory] = useState<string[]>(() => [router?.asPath])
  const subscribersRef = useRef<Subscriber[]>([])

  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) {
        setHistory((prevState) => {
          const newHistory = [...prevState, url]
          notifySubscribers(newHistory)
          return newHistory
        })
      }
    }

    router.beforePopState(() => {
      setHistory((prevState) => {
        const newHistory = prevState.slice(0, -2)
        notifySubscribers(newHistory)
        return newHistory
      })
      return true
    })

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const notifySubscribers = useCallback((newHistory: string[]) => {
    subscribersRef.current.forEach((subscriber) => {
      subscriber.setState(newHistory)
    })
  }, [])

  const subscribe = useCallback((subscriber: Subscriber) => {
    subscribersRef.current.push(subscriber)
  }, [])

  const unsubscribe = useCallback((subscriber: Subscriber) => {
    subscribersRef.current = subscribersRef.current.filter((sub) => sub !== subscriber)
  }, [])

  return useMemo(() => {
    return { history, canGoBack: () => history.length > 1, subscribe, unsubscribe }
  }, [history, subscribe, unsubscribe])
}
