import { useEffect } from 'react'
import { Box, PancakeTheme } from '@pancakeswap/uikit'
import { darkTheme, lightTheme } from 'components/layerZero/theme'

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
    const themeText = 'light'
    const themeColor = lightTheme
    console.log(window.app)

    customElements.whenDefined('lz-bridge').then(() => {
      document.body.classList.add(themeText)
      document.querySelector('aptos-bridge-container').setTheme(themeColor)
    })

    return () => {
      document.body.classList.remove(themeText)
    }
  }, [theme])

  return (
    <Box width="100%">
      <style jsx global>{`
        .aptos-bridge-container > div {
          padding: 24px !important;
          border-radius: 18px;
        }

        .aptos-bridge-container .css-r17wc3-LzButton {
          border: 1px solid #1fc7d4;
          border-radius: 8px;
          color: #1fc7d4;
          background: transparent;
        }

        // .light .css-1qbjrin-LzButton-SelectButtonRoot {
        //   background-color: rgb(238, 234, 244) !important;
        // }

        // .light a {
        //   color: rgb(122, 110, 170) !important;
        // }

        // .light .css-1h2mwam {
        //   border: solid 1px transparent;
        // }

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
