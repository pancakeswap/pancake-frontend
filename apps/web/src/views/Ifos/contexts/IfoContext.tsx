import { createContext, useContext, useState } from 'react'

export const IfoContext = createContext(null)

export function useConfig() {
  return useContext(IfoContext)
}

export default function IfoProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return <IfoContext.Provider value={{ isExpanded, setIsExpanded }}>{children}</IfoContext.Provider>
}
