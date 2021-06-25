import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }

    button, button div {
      background-color: #f3931a !important;
      color: white !important;
    }

    button[aria-label="Toggle menu"] {
      background-color: transparent !important;
    }

    button[class="sc-hKFxyN gdqowW sc-hOPeYd fYHEgG"],
    button[class="sc-hKFxyN mMaLf sc-hOPeYd gzoAWh"] {
      background-color: transparent !important;
    }

    button[class="sc-hKFxyN gdqowW sc-hOPeYd fYHEgG"]{
      color: black !important;
    }

    button[class="sc-hKFxyN mMaLf sc-hOPeYd gzoAWh"] {
      color: white !important;
    }

    div[class="sc-eGJWMs jrRmPQ"] > button[class="sc-hKFxyN gkDeJu"] {
      display: none;
    }
  }
`

export default GlobalStyle
