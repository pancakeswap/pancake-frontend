import { createGlobalStyle } from 'styled-components'
import { ThemeType } from '../../theme'

const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  body {
    background-color: ${props => props.theme.colors.bg};
    margin: 0;
    font-family: 'Noto Sans', sans-serif;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-repeat: no-repeat;
    background-position-y:50px;
    background-position-x:center;
    @media (max-width: 500px) {
      height: 100vh;
    }
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`

export default GlobalStyle

