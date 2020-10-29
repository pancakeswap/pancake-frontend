import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from '@pancakeswap-libs/uikit/dist/theme/types'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.background};
    @media (max-width: 500px) {
      height: 100vh;
    }
  }
`

export default GlobalStyle
