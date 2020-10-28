import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    @media (max-width: 500px) {
      height: 100vh;
    }
  }
`

export default GlobalStyle
