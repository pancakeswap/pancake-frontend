import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap-libs/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins',sans-serif;
  }
  body {
    background: #171716 url(https://halodefi.org/wp-content/uploads/2020/12/pattern-sweet-dots.svg);
    background-position: -40px;

    img {
      height: auto;
      max-width: 100%;
    }

    .ml-4 {
      margin-left: 1rem;
    }
    .items-start {
        align-items: flex-start;
    }
    .flex {
        display: flex;
    }
    .sm\:w-32 {
        width: 8rem;
    }
    .sm\:w-32 img {
      width: 8rem;
    }
    .h-20 {
        height: 5rem;
    }
    .newsitem {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 20px;
    }
    h4.text-sm.font-semibold {
        margin-bottom: 10px;
        color: #fff;
    }
    .rounded {
        border-radius: .25rem;
    }
    .pt-2.pb-6.flex.mx-4.border-b.border-gray-100 {
        line-height: 22px;
        color: #9a9a9a;
    }
    .rounded img {
        width: 16rem;
    }
    
  }

 
`

export default GlobalStyle
