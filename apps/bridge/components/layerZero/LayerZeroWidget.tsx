import { useEffect } from 'react'
import { Box, PancakeTheme } from '@pancakeswap/uikit'
import { darkTheme, lightTheme } from 'components/layerZero/theme'

declare global {
  interface Window {
    aptosBridge?: any
  }
  interface Document {
    querySelector?: any
  }
}

export const LayerZeroWidget = ({ theme }: { theme: PancakeTheme }) => {
  const themeText = theme.isDark ? 'dark' : 'light'
  const themeColor = theme.isDark ? darkTheme : lightTheme

  useEffect(() => {
    setTimeout(() => {
      if (window.aptosBridge) {
        document.body.classList.add(themeText)
        document.querySelector('aptos-bridge').setTheme(themeColor)
      }
    }, 400)

    return () => {
      document.body.classList.remove(themeText)
    }
  }, [themeColor, themeText])

  return (
    <Box width="100%">
      <style jsx global>{`
        .aptos-bridge-container > div {
          padding: 24px 0 !important;
          border-radius: 18px;
        }

        .css-twekd7 {
          margin-top: 32px !important;
        }

        .aptos-bridge-container > div > .MuiContainer-root {
          padding: 0 8px !important;
        }

        .dark [id^='radix-'] {
          background-color: #27262c;
        }

        .light [id^='radix-'] {
          background-color: #ffffff;
        }

        .css-11saint rect {
          fill: #d9d9d9;
        }

        .css-9k6lzc-LzButton,
        .css-1s9mcc4-LzButton {
          border: 1px solid #1fc7d4;
          border-radius: 8px;
          color: #1fc7d4;
          background: transparent;
        }
      `}</style>
      {/* @ts-ignore */}
      <aptos-bridge class="aptos-bridge-container" />
    </Box>
  )
}
