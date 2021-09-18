import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  @supports (font-variation-settings: normal) {
    html { font-family: 'Montserrat', sans-serif; }
  }
  
  * {
    font-family: 'Montserrat';
  }
  body {
       img {
      height: auto;
      max-width: 100%;
    }
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 7s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  a {
    text-decoration: none;

    :hover {
      text-decoration: none
    }
  }


@media screen and (max-width: 800px) {
  .three-line-legend {
    display: none !important;
  }
}

.tv-lightweight-charts{
  width: 100% !important;


  & > * {
    width: 100% !important;
  }
}


h1 {
	margin-top: calc(50vh - 10vw);
	text-align: center;
	background: linear-gradient(
		10deg,
		hsl(0, 75%, 50%) 10%,
		hsl(60, 75%, 50%) 85%,
		hsl(0, 75%, 50%) 85%
	);

	text-shadow: 0.5px -0.6vw #fff4;
	color: #fff;
	-webkit-background-clip: text;
   	-webkit-text-fill-color: transparent;
   	animation: 10s BeProud linear infinite,
   	3s Always ease alternate infinite;
}


@keyframes BeProud {
	100% { background-position: 100vw 0px; }
}

@keyframes Always {
	100% { transform: scale(1.1);}
}
`

export default GlobalStyle
