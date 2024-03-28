import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { ReactNode } from 'react'
import { SwapFeaturesProvider } from './SwapFeaturesContext'

function SwapLayout({ children }: { children: ReactNode }) {
  return (
    <SwapFeaturesProvider>
      {children}
      <V3SubgraphHealthIndicator />
    </SwapFeaturesProvider>
  )
}

export default SwapLayout
