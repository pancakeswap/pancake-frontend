import { createGlobalStyle } from 'styled-components'
import { ThemeType } from '.'

const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  body {
    background-color: ${(props) => props.theme.colors.bg};
    @media (max-width: 500px) {
      height: 100vh;
    }
  }
`

export default GlobalStyle
