import { createContext, useContext, useState, useMemo } from 'react'

export const IfoContext = createContext(null) as React.Context<any>

export function useConfig() {
  return useContext(IfoContext)
}

export default function IfoProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const providerValue = useMemo(() => ({ isExpanded, setIsExpanded }), [isExpanded])
  return <IfoContext.Provider value={providerValue}>{children}</IfoContext.Provider>
}
