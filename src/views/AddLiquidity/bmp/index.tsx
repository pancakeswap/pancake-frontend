import React from 'react'
import Providers from '../../../PageProvider.bmp'
import ErrorBoundary from '../../../components/ErrorBoundary'

function AddLiquidity() {
  return <view>add liquidity</view>
}

export default function Index() {
  return (
    <Providers>
      <ErrorBoundary name="addLiquidity">
        <AddLiquidity />
      </ErrorBoundary>
    </Providers>
  )
}
