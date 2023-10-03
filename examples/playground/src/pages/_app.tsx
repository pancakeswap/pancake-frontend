import '@/styles/globals.css'
import '@pancakeswap/uikit/styles'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
