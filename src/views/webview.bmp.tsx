import React, { useContext } from 'react'
import { WebviewContext } from '@pancakeswap/uikit'
import { View, WebView } from '@binance/mp-components'
import Providers from '../PageProvider.bmp'

const WebViewPage = () => {
  const { url } = useContext(WebviewContext)
  return (
    <View>
      <WebView src={url} />
    </View>
  )
}
export default function Page() {
  return (
    <Providers>
      <WebViewPage />
    </Providers>
  )
}
