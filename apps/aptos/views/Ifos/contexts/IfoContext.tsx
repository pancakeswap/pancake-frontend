import { createContext, useContext, useState } from 'react'

export const IfoContext = createContext(null) as React.Context<any>

export function useConfig() {
  return useContext(IfoContext)
}

export default function IfoProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return <IfoContext.Provider value={{ isExpanded, setIsExpanded }}>{children}</IfoContext.Provider>
}
