import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from '@pancakeswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    // background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }
  }

  #__next {
    position: relative;
    z-index: 1;
  }

  #portal-root {
    position: relative;
    z-index: 2;
  }


.sensei__table {
  overflow-x: auto;;
  width: 100%;
  border-collapse: collapse;
}
.sensei__table-header {
  height: 24px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 16px;
  line-height: 24px;
  display: flex;
  flex-direction: row;
}
.sensei__table-header-item {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.sensei__table-body {
  display: flex;
  flex-direction: column;
}
.sensei__table-body-tr {
  height: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.sensei__table-body-tr-hover {
  padding-left: 32px;
  padding-right: 32px;
  border-radius: 8px;
}
.sensei__table-body-tr-hover:hover {
  background-color: #1C1C1E;;
}
.sensei__table-body-td {
  color: #fff;
  height: 32px;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
}
`

export default GlobalStyle
