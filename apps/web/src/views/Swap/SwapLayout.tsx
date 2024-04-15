import { ReactNode } from 'react'
import { SwapFeaturesProvider } from './SwapFeaturesContext'

function SwapLayout({ children }: { children: ReactNode }) {
  return <SwapFeaturesProvider>{children}</SwapFeaturesProvider>
}

export default SwapLayout
