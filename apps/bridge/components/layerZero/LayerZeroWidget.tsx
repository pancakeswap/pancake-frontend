import { useEffect } from 'react'
import { Box, PancakeTheme } from '@pancakeswap/uikit'

declare global {
  interface Window {
    app?: any
  }
  interface Document {
    querySelector?: any
  }
}

export const LayerZeroWidget = ({ theme }: { theme: PancakeTheme }) => {
  useEffect(() => {
    const themeText = theme.isDark ? 'dark' : 'light'

    const fetch = async () => {
      const app: any = await customElements.whenDefined('lz-bridge')
      document.body.classList.add(themeText)
      const themeColor = theme.isDark ? app?.uiStore?.theme?.config?.dark : app?.uiStore?.theme?.config?.light
      app?.uiStore?.theme?.setTheme?.(themeColor)
    }

    fetch()
  }, [theme])

  return (
    <Box width="100%">
      <style jsx global>{`
        .aptos-bridge-container > div {
          padding: 24px !important;
          border-radius: 18px;
        }

        .bridge-tracker > div {
          padding: 24px;
        }
      `}</style>
      {/* @ts-ignore */}
      <lz-tracker class="bridge-tracker" />
      {/* @ts-ignore */}
      <lz-bridge class="aptos-bridge-container" />
    </Box>
  )
}
