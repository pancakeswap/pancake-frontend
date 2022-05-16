import { createContext, useContext } from 'react'
import { PredictionConfig } from 'state/types'

export const ConfigContext = createContext<PredictionConfig>(null)

export function useConfig() {
  return useContext(ConfigContext)
}

export default function ConfigProvider({ children, config }) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}
