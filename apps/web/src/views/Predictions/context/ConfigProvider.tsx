import { PredictionConfig } from '@pancakeswap/prediction'
import { createContext, useContext } from 'react'

export const ConfigContext = createContext<PredictionConfig | null>(null)

export function useConfig() {
  return useContext(ConfigContext)
}

export default function ConfigProvider({ children, config }) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}
