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

        .css-jvmc59-LzButton,
        .css-13uuqc2-LzButton {
          border: 1px solid #1fc7d4 !important;
          border-radius: 8px !important;
          color: #1fc7d4 !important;
          background: transparent !important;
        }

        .bridge-tracker > div {
          padding: 24px;
        }

        .css-y51smn,
        .css-1wv5d9i,
        .css-1feg5yw,
        .css-5bq2ar {
          border-radius: 18px !important;
        }

        .css-1mb6yox img {
          border-radius: 50%;
        }

        .css-11zlscq,
        .css-exxcyt,
        .css-m1do8g-LzButton,
        .css-1tw06gh-LzButton,
        .css-1tqvldl-InputWrapper,
        .css-13u8lrl-InputWrapper {
          border-radius: 18px !important;
        }

        .css-11zlscq {
          background-color: rgb(255, 255, 255) !important;
          border: 1px solid rgb(231, 227, 235) !important;
        }

        .css-1tw06gh-LzButton,
        .css-m1do8g-LzButton {
          color: white !important;
          background-color: rgb(30, 199, 211) !important;
        }

        .css-1eh4saz-LzButton-SelectButtonRoot,
        .css-5rl1po-LzButton-SelectButtonRoot {
          background-color: rgb(238, 234, 244) !important;
        }

        .css-5bq2ar {
          background-color: white !important;
        }

        .css-v2g2au .css-31r52u,
        .css-v2g2au .css-acv5hh {
          color: #1fc7d4;
        }
      `}</style>
      {/* @ts-ignore */}
      <lz-tracker class="bridge-tracker" />
      {/* @ts-ignore */}
      <lz-bridge class="aptos-bridge-container" />
    </Box>
  )
}
