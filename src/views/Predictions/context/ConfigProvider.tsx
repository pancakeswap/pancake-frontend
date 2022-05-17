import { createContext, useContext } from 'react'
import { PredictionConfig, PredictionSupportedSymbol } from 'state/types'

type ConfigCallback = (value: PredictionSupportedSymbol) => PredictionSupportedSymbol

export const ConfigContext =
  createContext<PredictionConfig & { setConfig: (value: PredictionSupportedSymbol | ConfigCallback) => void }>(null)

export function useConfig() {
  return useContext(ConfigContext)
}

export default function ConfigProvider({ children, config }) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}
